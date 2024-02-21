package com.example.webapp_test

import android.content.Context
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import com.example.webapp_test.ui.theme.Webapp_testTheme


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Webapp_testTheme {
                MyContent()
            }
        }
    }
}

fun injectJavaScript(webView: WebView, script: String) {
    webView.evaluateJavascript(script, null)
}

class CustomWebViewClient : WebViewClient() {
    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        //super.onPageStarted(view, url, favicon)

        // Inject JavaScript
        val script = "console.log('Hello, Android JS Injection!');"
        if (view != null) {
            injectJavaScript(view, script)
        }
    }
}

class AndroidJSInterface(private val context: Context) {

    /** Show a toast from the web page  */
    @JavascriptInterface
    fun showToast(toast: String?) {
        Toast.makeText(context, toast, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun testCall(msg: String): String {
        return "return from kotlin: $msg"
    }
}

// Creating a composable
// function to create WebView
// Calling this function as
// content in the above function
@Composable
fun MyContent() {

    // Declare a string that contains a url
    val mUrl = "http://127.0.0.1:9090/"

    // Adding a WebView inside AndroidView
    // with layout as full screen
    AndroidView(factory = {
        WebView(it).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )

            webViewClient = CustomWebViewClient()

            settings.javaScriptEnabled = true

            addJavascriptInterface(AndroidJSInterface(it), "Android")

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                WebView.setWebContentsDebuggingEnabled(true)
            }
        }
    }, update = {
        it.loadUrl(mUrl)
    })
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Webapp_testTheme {
        MyContent()
    }
}