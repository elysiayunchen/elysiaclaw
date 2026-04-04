import CoreLocation
import Foundation
import ElysiaClawKit
import UIKit

typealias ElysiaClawCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias ElysiaClawCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: ElysiaClawCameraSnapParams) async throws -> ElysiaClawCameraSnapResult
    func clip(params: ElysiaClawCameraClipParams) async throws -> ElysiaClawCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: ElysiaClawLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: ElysiaClawLocationGetParams,
        desiredAccuracy: ElysiaClawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: ElysiaClawLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> ElysiaClawDeviceStatusPayload
    func info() -> ElysiaClawDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: ElysiaClawPhotosLatestParams) async throws -> ElysiaClawPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: ElysiaClawContactsSearchParams) async throws -> ElysiaClawContactsSearchPayload
    func add(params: ElysiaClawContactsAddParams) async throws -> ElysiaClawContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: ElysiaClawCalendarEventsParams) async throws -> ElysiaClawCalendarEventsPayload
    func add(params: ElysiaClawCalendarAddParams) async throws -> ElysiaClawCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: ElysiaClawRemindersListParams) async throws -> ElysiaClawRemindersListPayload
    func add(params: ElysiaClawRemindersAddParams) async throws -> ElysiaClawRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: ElysiaClawMotionActivityParams) async throws -> ElysiaClawMotionActivityPayload
    func pedometer(params: ElysiaClawPedometerParams) async throws -> ElysiaClawPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: ElysiaClawWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
