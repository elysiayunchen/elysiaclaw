package ai.elysiaclaw.app.node

import ai.elysiaclaw.app.protocol.ElysiaClawCalendarCommand
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
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      ElysiaClawCapability.Canvas.rawValue,
      ElysiaClawCapability.Device.rawValue,
      ElysiaClawCapability.Notifications.rawValue,
      ElysiaClawCapability.System.rawValue,
      ElysiaClawCapability.Photos.rawValue,
      ElysiaClawCapability.Contacts.rawValue,
      ElysiaClawCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      ElysiaClawCapability.Camera.rawValue,
      ElysiaClawCapability.Location.rawValue,
      ElysiaClawCapability.Sms.rawValue,
      ElysiaClawCapability.VoiceWake.rawValue,
      ElysiaClawCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      ElysiaClawDeviceCommand.Status.rawValue,
      ElysiaClawDeviceCommand.Info.rawValue,
      ElysiaClawDeviceCommand.Permissions.rawValue,
      ElysiaClawDeviceCommand.Health.rawValue,
      ElysiaClawNotificationsCommand.List.rawValue,
      ElysiaClawNotificationsCommand.Actions.rawValue,
      ElysiaClawSystemCommand.Notify.rawValue,
      ElysiaClawPhotosCommand.Latest.rawValue,
      ElysiaClawContactsCommand.Search.rawValue,
      ElysiaClawContactsCommand.Add.rawValue,
      ElysiaClawCalendarCommand.Events.rawValue,
      ElysiaClawCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      ElysiaClawCameraCommand.Snap.rawValue,
      ElysiaClawCameraCommand.Clip.rawValue,
      ElysiaClawCameraCommand.List.rawValue,
      ElysiaClawLocationCommand.Get.rawValue,
      ElysiaClawMotionCommand.Activity.rawValue,
      ElysiaClawMotionCommand.Pedometer.rawValue,
      ElysiaClawSmsCommand.Send.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          smsAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(ElysiaClawMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(ElysiaClawMotionCommand.Pedometer.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    smsAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      smsAvailable = smsAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
