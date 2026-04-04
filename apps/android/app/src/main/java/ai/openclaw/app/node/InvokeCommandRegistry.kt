package ai.elysiaclaw.app.node

import ai.elysiaclaw.app.protocol.ElysiaClawCalendarCommand
import ai.elysiaclaw.app.protocol.ElysiaClawCanvasA2UICommand
import ai.elysiaclaw.app.protocol.ElysiaClawCanvasCommand
import ai.elysiaclaw.app.protocol.ElysiaClawCameraCommand
import ai.elysiaclaw.app.protocol.ElysiaClawCapability
import ai.elysiaclaw.app.protocol.ElysiaClawContactsCommand
import ai.elysiaclaw.app.protocol.ElysiaClawDeviceCommand
import ai.elysiaclaw.app.protocol.ElysiaClawLocationCommand
import ai.elysiaclaw.app.protocol.ElysiaClawMotionCommand
import ai.elysiaclaw.app.protocol.ElysiaClawNotificationsCommand
import ai.elysiaclaw.app.protocol.ElysiaClawPhotosCommand
import ai.elysiaclaw.app.protocol.ElysiaClawSmsCommand
import ai.elysiaclaw.app.protocol.ElysiaClawSystemCommand

data class NodeRuntimeFlags(
  val cameraEnabled: Boolean,
  val locationEnabled: Boolean,
  val smsAvailable: Boolean,
  val voiceWakeEnabled: Boolean,
  val motionActivityAvailable: Boolean,
  val motionPedometerAvailable: Boolean,
  val debugBuild: Boolean,
)

enum class InvokeCommandAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  MotionActivityAvailable,
  MotionPedometerAvailable,
  DebugBuild,
}

enum class NodeCapabilityAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  VoiceWakeEnabled,
  MotionAvailable,
}

data class NodeCapabilitySpec(
  val name: String,
  val availability: NodeCapabilityAvailability = NodeCapabilityAvailability.Always,
)

data class InvokeCommandSpec(
  val name: String,
  val requiresForeground: Boolean = false,
  val availability: InvokeCommandAvailability = InvokeCommandAvailability.Always,
)

object InvokeCommandRegistry {
  val capabilityManifest: List<NodeCapabilitySpec> =
    listOf(
      NodeCapabilitySpec(name = ElysiaClawCapability.Canvas.rawValue),
      NodeCapabilitySpec(name = ElysiaClawCapability.Device.rawValue),
      NodeCapabilitySpec(name = ElysiaClawCapability.Notifications.rawValue),
      NodeCapabilitySpec(name = ElysiaClawCapability.System.rawValue),
      NodeCapabilitySpec(
        name = ElysiaClawCapability.Camera.rawValue,
        availability = NodeCapabilityAvailability.CameraEnabled,
      ),
      NodeCapabilitySpec(
        name = ElysiaClawCapability.Sms.rawValue,
        availability = NodeCapabilityAvailability.SmsAvailable,
      ),
      NodeCapabilitySpec(
        name = ElysiaClawCapability.VoiceWake.rawValue,
        availability = NodeCapabilityAvailability.VoiceWakeEnabled,
      ),
      NodeCapabilitySpec(
        name = ElysiaClawCapability.Location.rawValue,
        availability = NodeCapabilityAvailability.LocationEnabled,
      ),
      NodeCapabilitySpec(name = ElysiaClawCapability.Photos.rawValue),
      NodeCapabilitySpec(name = ElysiaClawCapability.Contacts.rawValue),
      NodeCapabilitySpec(name = ElysiaClawCapability.Calendar.rawValue),
      NodeCapabilitySpec(
        name = ElysiaClawCapability.Motion.rawValue,
        availability = NodeCapabilityAvailability.MotionAvailable,
      ),
    )

  val all: List<InvokeCommandSpec> =
    listOf(
      InvokeCommandSpec(
        name = ElysiaClawCanvasCommand.Present.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasCommand.Hide.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasCommand.Navigate.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasCommand.Eval.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasCommand.Snapshot.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasA2UICommand.Push.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasA2UICommand.PushJSONL.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCanvasA2UICommand.Reset.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = ElysiaClawSystemCommand.Notify.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCameraCommand.List.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCameraCommand.Snap.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCameraCommand.Clip.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = ElysiaClawLocationCommand.Get.rawValue,
        availability = InvokeCommandAvailability.LocationEnabled,
      ),
      InvokeCommandSpec(
        name = ElysiaClawDeviceCommand.Status.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawDeviceCommand.Info.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawDeviceCommand.Permissions.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawDeviceCommand.Health.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawNotificationsCommand.List.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawNotificationsCommand.Actions.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawPhotosCommand.Latest.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawContactsCommand.Search.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawContactsCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCalendarCommand.Events.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawCalendarCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = ElysiaClawMotionCommand.Activity.rawValue,
        availability = InvokeCommandAvailability.MotionActivityAvailable,
      ),
      InvokeCommandSpec(
        name = ElysiaClawMotionCommand.Pedometer.rawValue,
        availability = InvokeCommandAvailability.MotionPedometerAvailable,
      ),
      InvokeCommandSpec(
        name = ElysiaClawSmsCommand.Send.rawValue,
        availability = InvokeCommandAvailability.SmsAvailable,
      ),
      InvokeCommandSpec(
        name = "debug.logs",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(
        name = "debug.ed25519",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
    )

  private val byNameInternal: Map<String, InvokeCommandSpec> = all.associateBy { it.name }

  fun find(command: String): InvokeCommandSpec? = byNameInternal[command]

  fun advertisedCapabilities(flags: NodeRuntimeFlags): List<String> {
    return capabilityManifest
      .filter { spec ->
        when (spec.availability) {
          NodeCapabilityAvailability.Always -> true
          NodeCapabilityAvailability.CameraEnabled -> flags.cameraEnabled
          NodeCapabilityAvailability.LocationEnabled -> flags.locationEnabled
          NodeCapabilityAvailability.SmsAvailable -> flags.smsAvailable
          NodeCapabilityAvailability.VoiceWakeEnabled -> flags.voiceWakeEnabled
          NodeCapabilityAvailability.MotionAvailable -> flags.motionActivityAvailable || flags.motionPedometerAvailable
        }
      }
      .map { it.name }
  }

  fun advertisedCommands(flags: NodeRuntimeFlags): List<String> {
    return all
      .filter { spec ->
        when (spec.availability) {
          InvokeCommandAvailability.Always -> true
          InvokeCommandAvailability.CameraEnabled -> flags.cameraEnabled
          InvokeCommandAvailability.LocationEnabled -> flags.locationEnabled
          InvokeCommandAvailability.SmsAvailable -> flags.smsAvailable
          InvokeCommandAvailability.MotionActivityAvailable -> flags.motionActivityAvailable
          InvokeCommandAvailability.MotionPedometerAvailable -> flags.motionPedometerAvailable
          InvokeCommandAvailability.DebugBuild -> flags.debugBuild
        }
      }
      .map { it.name }
  }
}
