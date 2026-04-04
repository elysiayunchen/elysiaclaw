// swift-tools-version: 6.2
// Package manifest for the ElysiaClaw macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "ElysiaClaw",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "ElysiaClawIPC", targets: ["ElysiaClawIPC"]),
        .library(name: "ElysiaClawDiscovery", targets: ["ElysiaClawDiscovery"]),
        .executable(name: "ElysiaClaw", targets: ["ElysiaClaw"]),
        .executable(name: "elysiaclaw-mac", targets: ["ElysiaClawMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/ElysiaClawKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "ElysiaClawIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "ElysiaClawDiscovery",
            dependencies: [
                .product(name: "ElysiaClawKit", package: "ElysiaClawKit"),
            ],
            path: "Sources/ElysiaClawDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "ElysiaClaw",
            dependencies: [
                "ElysiaClawIPC",
                "ElysiaClawDiscovery",
                .product(name: "ElysiaClawKit", package: "ElysiaClawKit"),
                .product(name: "ElysiaClawChatUI", package: "ElysiaClawKit"),
                .product(name: "ElysiaClawProtocol", package: "ElysiaClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/ElysiaClaw.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "ElysiaClawMacCLI",
            dependencies: [
                "ElysiaClawDiscovery",
                .product(name: "ElysiaClawKit", package: "ElysiaClawKit"),
                .product(name: "ElysiaClawProtocol", package: "ElysiaClawKit"),
            ],
            path: "Sources/ElysiaClawMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "ElysiaClawIPCTests",
            dependencies: [
                "ElysiaClawIPC",
                "ElysiaClaw",
                "ElysiaClawDiscovery",
                .product(name: "ElysiaClawProtocol", package: "ElysiaClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
