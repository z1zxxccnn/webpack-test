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
    
    deinit {
        self.cleanWebViewCache()
    }
    
    override func loadView() {
        self.cleanWebViewCache()
        let preferences = WKPreferences()
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        self.myWebView_ = WKWebView(frame: CGRect.zero, configuration: configuration)
        self.myWebView_?.isInspectable = true
        self.view = self.myWebView_
    }
    
    func cleanWebViewCache() {
        HTTPCookieStorage.shared.removeCookies(since: Date.distantPast)
        print("all cookies deleted")
        
        WKWebsiteDataStore.default().fetchDataRecords(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes()) { records in
            records.forEach { record in
                WKWebsiteDataStore.default().removeData(ofTypes: record.dataTypes, for: [record], completionHandler: {})
                print("record deleted: \(record)")
            }
        }
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
