// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "ElysiaClawKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "ElysiaClawProtocol", targets: ["ElysiaClawProtocol"]),
        .library(name: "ElysiaClawKit", targets: ["ElysiaClawKit"]),
        .library(name: "ElysiaClawChatUI", targets: ["ElysiaClawChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "ElysiaClawProtocol",
            path: "Sources/ElysiaClawProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "ElysiaClawKit",
            dependencies: [
                "ElysiaClawProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/ElysiaClawKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "ElysiaClawChatUI",
            dependencies: [
                "ElysiaClawKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/ElysiaClawChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "ElysiaClawKitTests",
            dependencies: ["ElysiaClawKit", "ElysiaClawChatUI"],
            path: "Tests/ElysiaClawKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
