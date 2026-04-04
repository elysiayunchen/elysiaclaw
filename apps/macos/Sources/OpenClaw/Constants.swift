import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-elysiaclaw writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.elysiaclaw.mac"
let gatewayLaunchdLabel = "ai.elysiaclaw.gateway"
let onboardingVersionKey = "elysiaclaw.onboardingVersion"
let onboardingSeenKey = "elysiaclaw.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "elysiaclaw.pauseEnabled"
let iconAnimationsEnabledKey = "elysiaclaw.iconAnimationsEnabled"
let swabbleEnabledKey = "elysiaclaw.swabbleEnabled"
let swabbleTriggersKey = "elysiaclaw.swabbleTriggers"
let voiceWakeTriggerChimeKey = "elysiaclaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "elysiaclaw.voiceWakeSendChime"
let showDockIconKey = "elysiaclaw.showDockIcon"
let defaultVoiceWakeTriggers = ["elysiaclaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "elysiaclaw.voiceWakeMicID"
let voiceWakeMicNameKey = "elysiaclaw.voiceWakeMicName"
let voiceWakeLocaleKey = "elysiaclaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "elysiaclaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "elysiaclaw.voicePushToTalkEnabled"
let talkEnabledKey = "elysiaclaw.talkEnabled"
let iconOverrideKey = "elysiaclaw.iconOverride"
let connectionModeKey = "elysiaclaw.connectionMode"
let remoteTargetKey = "elysiaclaw.remoteTarget"
let remoteIdentityKey = "elysiaclaw.remoteIdentity"
let remoteProjectRootKey = "elysiaclaw.remoteProjectRoot"
let remoteCliPathKey = "elysiaclaw.remoteCliPath"
let canvasEnabledKey = "elysiaclaw.canvasEnabled"
let cameraEnabledKey = "elysiaclaw.cameraEnabled"
let systemRunPolicyKey = "elysiaclaw.systemRunPolicy"
let systemRunAllowlistKey = "elysiaclaw.systemRunAllowlist"
let systemRunEnabledKey = "elysiaclaw.systemRunEnabled"
let locationModeKey = "elysiaclaw.locationMode"
let locationPreciseKey = "elysiaclaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "elysiaclaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "elysiaclaw.deepLinkKey"
let modelCatalogPathKey = "elysiaclaw.modelCatalogPath"
let modelCatalogReloadKey = "elysiaclaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "elysiaclaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "elysiaclaw.heartbeatsEnabled"
let debugPaneEnabledKey = "elysiaclaw.debugPaneEnabled"
let debugFileLogEnabledKey = "elysiaclaw.debug.fileLogEnabled"
let appLogLevelKey = "elysiaclaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
