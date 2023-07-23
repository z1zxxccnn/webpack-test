//
//  mywebview.swift
//  webapp_test
//
//  Created by ztcd on 2023/7/24.
//

import Foundation
import WebKit
import SwiftUI

class MyWebViewController: UIViewController {
    var myWebView_: WKWebView? = nil
    
    override func loadView() {
        let preferences = WKPreferences()
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        self.myWebView_ = WKWebView(frame: CGRect.zero, configuration: configuration)
        self.view = self.myWebView_
    }
}

struct MyWebViewControllerRep: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> MyWebViewController {
        let controller = MyWebViewController()
        return controller
    }
    
    func updateUIViewController(_ uiViewController: MyWebViewController, context: Context) {
        if let url = URL(string: "http://127.0.0.1:9090/") {
            uiViewController.myWebView_?.load(URLRequest(url: url))
        }
    }
    
    typealias UIViewControllerType = MyWebViewController
}
