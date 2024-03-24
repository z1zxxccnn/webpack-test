//
//  mywebview.swift
//  webapp_test
//
//  Created by ztcd on 2024/3/24.
//

import Foundation
import WebKit
import SwiftUI
import Combine

enum MyWebViewAction {
    case willTerminate
}

class MyWebViewLink: ObservableObject {
    @Published var action: MyWebViewAction?
    
    func willTerminate() {
        action = .willTerminate
    }
}

class MyWebViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler, WKScriptMessageHandlerWithReply {
    var myWebView_: WKWebView? = nil
    let myTestMsgName: String = "myTestMsgName"
    let myTestMsgNameWithReply: String = "myTestMsgNameWithReply"
    
    func action(_ action: MyWebViewAction) {
        print("MyWebViewController execute action: \(action)")
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
        let userScript = WKUserScript(source: "console.log(\"WKWebView user script test!\")", injectionTime: .atDocumentStart, forMainFrameOnly: false)
        configuration.userContentController.addUserScript(userScript)
        self.view = self.myWebView_ ?? self.view
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("navigation from the main frame has started")
    }
    
    func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
        print("the web view received a server redirect for a request")
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        print("the web view has started to receive content for the main frame")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("navigation is complete")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("an error occurred during navigation: \(error)")
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("an error occurred during the early navigation process: \(error)")
    }
    
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        print("the web view’s content process was terminated")
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

struct MyWebViewControllerRep: NSViewControllerRepresentable {
    var vcLink: MyWebViewLink
    
    class Coordinator {
        var vcLink: MyWebViewLink? {
            didSet {
                cancelable = vcLink?.$action.sink(receiveValue: { (action) in
                    guard let action = action else {
                        return
                    }
                    self.viewController?.action(action)
                })
            }
        }
        var viewController: MyWebViewController?
        
        private var cancelable: AnyCancellable?
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator()
    }
    
    func makeNSViewController(context: Context) -> MyWebViewController {
        let controller = MyWebViewController()
        return controller
    }
    
    func updateNSViewController(_ uiViewController: MyWebViewController, context: Context) {
        context.coordinator.viewController = uiViewController
        context.coordinator.vcLink = vcLink
        if let url = URL(string: "http://127.0.0.1:9090/") {
            uiViewController.myWebView_?.load(URLRequest(url: url))
        }
    }
    
    typealias NSViewControllerType = MyWebViewController
}
