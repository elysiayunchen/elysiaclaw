package ai.elysiaclaw.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class ElysiaClawProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", ElysiaClawCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", ElysiaClawCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", ElysiaClawCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", ElysiaClawCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", ElysiaClawCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", ElysiaClawCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", ElysiaClawCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", ElysiaClawCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", ElysiaClawCapability.Canvas.rawValue)
    assertEquals("camera", ElysiaClawCapability.Camera.rawValue)
    assertEquals("voiceWake", ElysiaClawCapability.VoiceWake.rawValue)
    assertEquals("location", ElysiaClawCapability.Location.rawValue)
    assertEquals("sms", ElysiaClawCapability.Sms.rawValue)
    assertEquals("device", ElysiaClawCapability.Device.rawValue)
    assertEquals("notifications", ElysiaClawCapability.Notifications.rawValue)
    assertEquals("system", ElysiaClawCapability.System.rawValue)
    assertEquals("photos", ElysiaClawCapability.Photos.rawValue)
    assertEquals("contacts", ElysiaClawCapability.Contacts.rawValue)
    assertEquals("calendar", ElysiaClawCapability.Calendar.rawValue)
    assertEquals("motion", ElysiaClawCapability.Motion.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", ElysiaClawCameraCommand.List.rawValue)
    assertEquals("camera.snap", ElysiaClawCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", ElysiaClawCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", ElysiaClawNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", ElysiaClawNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", ElysiaClawDeviceCommand.Status.rawValue)
    assertEquals("device.info", ElysiaClawDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", ElysiaClawDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", ElysiaClawDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", ElysiaClawSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", ElysiaClawPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", ElysiaClawContactsCommand.Search.rawValue)
    assertEquals("contacts.add", ElysiaClawContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", ElysiaClawCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", ElysiaClawCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", ElysiaClawMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", ElysiaClawMotionCommand.Pedometer.rawValue)
  }
}
