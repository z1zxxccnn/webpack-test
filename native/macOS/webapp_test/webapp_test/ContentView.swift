//
//  ContentView.swift
//  webapp_test
//
//  Created by ztcd on 2024/3/17.
//

import SwiftUI

struct ContentView: View {
    @StateObject var vcLink = MyWebViewLink()
    @State private var window: NSWindow?
    var body: some View {
        VStack(spacing: 0) {
            MyWebViewControllerRep(vcLink: vcLink, window: $window)
                .ignoresSafeArea(edges: .all)
                .onReceive(NotificationCenter.default.publisher(for: NSApplication.willTerminateNotification), perform: { _ in
                    print("receive willTerminateNotification")
                    vcLink.willTerminate()
                })
                .task {
                    print("swiftui main window: \(String(describing: window))")
                }
            if (vcLink.isShowTestBtn) {
                Button(action: {
                    vcLink.setShowTestBtn(isOn: false)
                }) {
                    Text("Hide Test Button")
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
