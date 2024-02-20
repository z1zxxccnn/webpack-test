package com.example.webapp_test

import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
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

// Creating a composable
// function to create WebView
// Calling this function as
// content in the above function
@Composable
fun MyContent(){

    // Declare a string that contains a url
    val mUrl = "https://www.google.com/"

    // Adding a WebView inside AndroidView
    // with layout as full screen
    AndroidView(factory = {
        WebView(it).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
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