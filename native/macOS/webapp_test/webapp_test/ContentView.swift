//
//  ContentView.swift
//  webapp_test
//
//  Created by ztcd on 2024/3/17.
//

import SwiftUI

struct ContentView: View {
    @StateObject var vcLink = MyWebViewLink()
    var body: some View {
        MyWebViewControllerRep(vcLink: vcLink)
            .ignoresSafeArea(edges: .all)
            .onReceive(NotificationCenter.default.publisher(for: NSApplication.willTerminateNotification), perform: { _ in
                print("receive willTerminateNotification")
                vcLink.willTerminate()
            })
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
