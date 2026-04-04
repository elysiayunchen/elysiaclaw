import Foundation

public enum ElysiaClawCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum ElysiaClawCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum ElysiaClawCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum ElysiaClawCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct ElysiaClawCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: ElysiaClawCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: ElysiaClawCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: ElysiaClawCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: ElysiaClawCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct ElysiaClawCameraClipParams: Codable, Sendable, Equatable {
    public var facing: ElysiaClawCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: ElysiaClawCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: ElysiaClawCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: ElysiaClawCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
