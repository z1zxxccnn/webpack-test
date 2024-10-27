package com.example.webapp_test

import android.app.Activity
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
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.webapp_test.ui.theme.Webapp_testTheme


class MyViewModel : ViewModel() {
    private val _showTestBtn = MutableLiveData(false)
    val showTestBtn: LiveData<Boolean> = _showTestBtn

    fun updateShowTestBtn(on: Boolean) {
        _showTestBtn.postValue(on)
    }
}

class MainActivity : ComponentActivity() {
    private val myViewModel by viewModels<MyViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Webapp_testTheme {
                MyContent(myViewModel = myViewModel)
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

class AndroidJSInterface(
    private val context: Context,
    private val myViewModel: MyViewModel
) {
    /** Show a toast from the web page  */
    @JavascriptInterface
    fun showToast(toast: String?) {
        Toast.makeText(context, toast, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun exitApp() {
        (context as Activity).finish()
    }

    @JavascriptInterface
    fun testCall(msg: String): String {
        return "return from kotlin: $msg"
    }

    @JavascriptInterface
    fun showTestBtn() {
        myViewModel.updateShowTestBtn(true)
    }
}

// Creating a composable
// function to create WebView
// Calling this function as
// content in the above function
@Composable
fun MyContent(myViewModel: MyViewModel) {
    // Declare a string that contains a url
    val mUrl = "http://127.0.0.1:9090/"

    val showTestBtn by myViewModel.showTestBtn.observeAsState()

    val view: MutableState<WebView?> = remember { mutableStateOf(null) }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Adding a WebView inside AndroidView
        // with layout as full screen
        AndroidView(factory = {
            WebView(it).apply {
                view.value = this

                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                webViewClient = CustomWebViewClient()

                settings.javaScriptEnabled = true

                addJavascriptInterface(AndroidJSInterface(it, myViewModel), "Android")

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    WebView.setWebContentsDebuggingEnabled(true)
                }

                clearCache(true)
                println("WebView enters the Composition")
            }
        }, update = {
            it.loadUrl(mUrl)
        }, modifier = Modifier.weight(1f))
        if (showTestBtn == true) {
            Button(onClick = { myViewModel.updateShowTestBtn(false) }) {
                Text(text = "TEST")
            }
        }
    }

    DisposableEffect(view) {
        onDispose {
            view.value?.clearCache(true)
            view.value = null
            println("WebView leaves the Composition")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Webapp_testTheme {
    }
}