// webapp_test.cpp : Defines the entry point for the application.
//

#include "framework.h"
#include "webapp_test.h"
#include "HostObjectMainImpl.h"

#define MAX_LOADSTRING 100

// Global Variables:
HINSTANCE hInst;                                // current instance
WCHAR szTitle[MAX_LOADSTRING];                  // The title bar text
WCHAR szWindowClass[MAX_LOADSTRING];            // the main window class name

wil::com_ptr<ICoreWebView2Controller> webviewController;
wil::com_ptr<ICoreWebView2> webview;
wil::com_ptr<HostObjectMain> hostObject;

static constexpr UINT s_runAsyncWindowMessage = WM_APP + 1;

// Forward declarations of functions included in this code module:
ATOM                MyRegisterClass(HINSTANCE hInstance);
BOOL                InitInstance(HINSTANCE, int);
LRESULT CALLBACK    WndProc(HWND, UINT, WPARAM, LPARAM);
INT_PTR CALLBACK    About(HWND, UINT, WPARAM, LPARAM);

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
    _In_opt_ HINSTANCE hPrevInstance,
    _In_ LPWSTR    lpCmdLine,
    _In_ int       nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    // TODO: Place code here.

    // Initialize global strings
    LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    LoadStringW(hInstance, IDC_WEBAPPTEST, szWindowClass, MAX_LOADSTRING);
    MyRegisterClass(hInstance);

    // Perform application initialization:
    if (!InitInstance(hInstance, nCmdShow))
    {
        return FALSE;
    }

    HACCEL hAccelTable = LoadAccelerators(hInstance, MAKEINTRESOURCE(IDC_WEBAPPTEST));

    MSG msg;

    // Main message loop:
    while (GetMessage(&msg, nullptr, 0, 0))
    {
        if (!TranslateAccelerator(msg.hwnd, hAccelTable, &msg))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
    }

    return (int)msg.wParam;
}



//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXW wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.cbClsExtra = 0;
    wcex.cbWndExtra = 0;
    wcex.hInstance = hInstance;
    wcex.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_WEBAPPTEST));
    wcex.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wcex.lpszMenuName = nullptr;
    wcex.lpszClassName = szWindowClass;
    wcex.hIconSm = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExW(&wcex);
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
    hInst = hInstance; // Store instance handle in our global variable

    HWND hWnd = CreateWindowW(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, 0, CW_USEDEFAULT, 0, nullptr, nullptr, hInstance, nullptr);

    if (!hWnd)
    {
        return FALSE;
    }

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);

    // Step 3 - Create a single WebView within the parent window
    // Locate the browser and set up the environment for WebView
    CreateCoreWebView2EnvironmentWithOptions(nullptr, nullptr, nullptr,
        Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
            [hWnd](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {
                if (FAILED(result)) {
                    std::wstring output = L"CreateCoreWebView2EnvironmentWithOptions failed: ";
                    output += std::to_wstring(result);
                    output += L"\n";
                    OutputDebugString(output.c_str());
                    return S_OK;
                }

                // Create a CoreWebView2Controller and get the associated CoreWebView2 whose parent is the main window hWnd
                env->CreateCoreWebView2Controller(hWnd, Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
                    [hWnd](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
                        if (FAILED(result)) {
                            std::wstring output = L"CreateCoreWebView2Controller failed: ";
                            output += std::to_wstring(result);
                            output += L"\n";
                            OutputDebugString(output.c_str());
                            return S_OK;
                        }

                        webviewController = controller;
                        webviewController->get_CoreWebView2(&webview);

                        // Add a few settings for the webview
                        // The demo step is redundant since the values are the default settings
                        wil::com_ptr<ICoreWebView2Settings> settings;
                        webview->get_Settings(&settings);
                        settings->put_IsScriptEnabled(TRUE);
                        settings->put_AreDefaultScriptDialogsEnabled(TRUE);
                        settings->put_IsWebMessageEnabled(TRUE);

                        // Resize WebView to fit the bounds of the parent window
                        RECT bounds;
                        GetClientRect(hWnd, &bounds);
                        webviewController->put_Bounds(bounds);

                        // Schedule an async task to navigate to Bing
                        webview->Navigate(L"https://www.bing.com/");

                        // Step 4 - Navigation events
                        EventRegistrationToken token;
                        webview->add_NavigationStarting(Microsoft::WRL::Callback<ICoreWebView2NavigationStartingEventHandler>(
                            [hWnd](ICoreWebView2* webview, ICoreWebView2NavigationStartingEventArgs* args) -> HRESULT {
                                hostObject = Microsoft::WRL::Make<HostObjectMain>(
                                    [hWnd](std::function<void(void)> callback) {
                                        auto* task = new std::function<void()>(std::move(callback));
                                        PostMessage(hWnd, s_runAsyncWindowMessage, reinterpret_cast<WPARAM>(task), 0);
                                    });
                                VARIANT remoteObjectAsVariant = {};
                                hostObject.query_to<IDispatch>(&remoteObjectAsVariant.pdispVal);
                                remoteObjectAsVariant.vt = VT_DISPATCH;
                                webview->AddHostObjectToScript(L"main", &remoteObjectAsVariant);
                                remoteObjectAsVariant.pdispVal->Release();
                                return S_OK;
                            }).Get(), &token);

                        // Step 5 - Scripting
                        webview->AddScriptToExecuteOnDocumentCreated(L"console.log(\"call from webapp_test c++!\");", nullptr);
                        webview->ExecuteScript(L"window.document.URL;", Microsoft::WRL::Callback<ICoreWebView2ExecuteScriptCompletedHandler>(
                            [](HRESULT errorCode, LPCWSTR resultObjectAsJson) -> HRESULT {
                                std::wstring output = L"ExecuteScript test: ";
                                output += resultObjectAsJson;
                                output += L"\n";
                                OutputDebugString(output.c_str());
                                return S_OK;
                            }).Get());
                        return S_OK;
                    }).Get());
                return S_OK;
            }).Get());

    return TRUE;
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case s_runAsyncWindowMessage:
    {
        auto* task = reinterpret_cast<std::function<void()>*>(wParam);
        (*task)();
        delete task;
        return true;
    }
    break;
    case WM_COMMAND:
    {
        int wmId = LOWORD(wParam);
        // Parse the menu selections:
        switch (wmId)
        {
        case IDM_ABOUT:
            DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
            break;
        case IDM_EXIT:
            DestroyWindow(hWnd);
            break;
        default:
            return DefWindowProc(hWnd, message, wParam, lParam);
        }
    }
    break;
    case WM_PAINT:
    {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hWnd, &ps);
        // TODO: Add any drawing code that uses hdc here...
        EndPaint(hWnd, &ps);
    }
    break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}
