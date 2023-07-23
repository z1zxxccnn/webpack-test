//
//  mywebview.swift
//  webapp_test
//
//  Created by ztcd on 2023/7/24.
//

import Foundation
import WebKit
import SwiftUI

class MyWebViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler, WKScriptMessageHandlerWithReply {
    var myWebView_: WKWebView? = nil
    let myTestMsgName: String = "myTestMsgName"
    let myTestMsgNameWithReply: String = "myTestMsgNameWithReply"
    
    deinit {
        self.cleanWebViewCache()
    }
    
    override func loadView() {
        self.cleanWebViewCache()
        let preferences = WKPreferences()
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        configuration.websiteDataStore = WKWebsiteDataStore.nonPersistent()
        self.myWebView_ = WKWebView(frame: CGRect.zero, configuration: configuration)
        self.myWebView_?.isInspectable = true
        self.myWebView_?.navigationDelegate = self
        configuration.userContentController.add(self, name: self.myTestMsgName)
        configuration.userContentController.addScriptMessageHandler(self, contentWorld: .page, name: self.myTestMsgNameWithReply)
        self.view = self.myWebView_
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        print("navigationType: \(navigationAction.navigationType), shouldPerformDownload: \(navigationAction.shouldPerformDownload), request.url: \(String(describing: navigationAction.request.url))")
        if !navigationAction.shouldPerformDownload {
            decisionHandler(.allow)
        } else {
            decisionHandler(.download)
        }
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == self.myTestMsgName {
            print("call \(self.myTestMsgName) message body: \(message.body)")
        }
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage, replyHandler: @escaping (Any?, String?) -> Void) {
        if message.name == self.myTestMsgNameWithReply {
            print("call \(self.myTestMsgNameWithReply) message body: \(message.body)")
            replyHandler("This is a reply from \(self.myTestMsgNameWithReply)", nil)
        }
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
