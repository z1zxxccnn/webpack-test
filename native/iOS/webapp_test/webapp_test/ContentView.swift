//
//  ContentView.swift
//  webapp_test
//
//  Created by ztcd on 2023/7/23.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        MyWebViewControllerRep().ignoresSafeArea(edges: .all)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
