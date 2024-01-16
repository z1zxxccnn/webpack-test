// Copyright (C) Microsoft Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "framework.h"

#include "HostObjectMainImpl.h"

static HRESULT TestGetIDispatchMethods(IDispatch* pDisp, std::map<long, std::wstring>& methodsMap)
{
    HRESULT hr = S_OK;

    wil::com_ptr<IDispatch> spDisp(pDisp);
    if (!spDisp)
        return E_INVALIDARG;

    wil::com_ptr<ITypeInfo> spTypeInfo;
    hr = spDisp->GetTypeInfo(0, LOCALE_USER_DEFAULT, &spTypeInfo);
    if (SUCCEEDED(hr) && spTypeInfo)
    {
        TYPEATTR* pTatt = nullptr;
        hr = spTypeInfo->GetTypeAttr(&pTatt);
        if (SUCCEEDED(hr) && pTatt)
        {
            FUNCDESC* fd = nullptr;
            for (int i = 0; i < pTatt->cFuncs; ++i)
            {
                hr = spTypeInfo->GetFuncDesc(i, &fd);
                if (SUCCEEDED(hr) && fd)
                {
                    BSTR funcName = nullptr;
                    spTypeInfo->GetDocumentation(fd->memid, &funcName, nullptr, nullptr, nullptr);
                    std::wstring funcNameStr = funcName;
                    if (funcNameStr.length() > 0)
                    {
                        methodsMap[fd->memid] = funcName;
                    }
                    spTypeInfo->ReleaseFuncDesc(fd);
                }
            }
            spTypeInfo->ReleaseTypeAttr(pTatt);
        }
    }

    return hr;
}

HostObjectMain::HostObjectMain(HostObjectMain::RunCallbackAsync runCallbackAsync)
    : m_testPropertyValue(L"Example Property String Value"), m_runCallbackAsync(runCallbackAsync)
{
}

STDMETHODIMP HostObjectMain::MainInterface(BSTR stringParam, BSTR* stringRes)
{
    std::wstring result = L"MainInterface(";
    result += stringParam;
    result += L") called.";
    *stringRes = SysAllocString(result.c_str());
    return S_OK;
}

STDMETHODIMP HostObjectMain::TestCbAsyncWithStringAndInt(IDispatch* callbackParam)
{
    {
        std::map<long, std::wstring> tmp;
        TestGetIDispatchMethods(callbackParam, tmp);
    }

    wil::com_ptr<IDispatch> callbackParamForCapture = callbackParam;
    m_runCallbackAsync([callbackParamForCapture]() -> void {
        DISPPARAMS dp = { nullptr, nullptr, 0, 0 };
        VARIANT* args = new VARIANT[2];
        VariantInit(&args[0]);
        VariantInit(&args[1]);
        args[0].vt = VT_INT;
        args[0].intVal = 0;
        args[1].vt = VT_BSTR;
        args[1].bstrVal = SysAllocString(L"TEST");
        dp.rgvarg = args;
        dp.cArgs = 2;
        VARIANT result;
        VariantInit(&result);
        callbackParamForCapture->Invoke(
            DISPID_UNKNOWN, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_METHOD, &dp, &result,
            nullptr, nullptr);
        VariantClear(&result);
        VariantClear(&args[1]);
        VariantClear(&args[0]);
        delete[] args;
        });

    return S_OK;
}

STDMETHODIMP HostObjectMain::TestMethodWithStringAndInt(BSTR stringParam, INT intParam)
{
    std::wstring output = L"TestMethodWithStringAndInt(";
    output += stringParam;
    output += L", ";
    output += std::to_wstring(intParam);
    output += L") called.\n";
    OutputDebugString(output.c_str());
    return S_OK;
}

STDMETHODIMP HostObjectMain::get_TestProperty(BSTR* stringResult)
{
    *stringResult = SysAllocString(m_testPropertyValue.c_str());
    return S_OK;
}

STDMETHODIMP HostObjectMain::put_TestProperty(BSTR stringValue)
{
    m_testPropertyValue = stringValue;
    return S_OK;
}

STDMETHODIMP HostObjectMain::get_TestIndexedProperty(INT index, BSTR* stringResult)
{
    *stringResult = SysAllocString(m_testPropertyValues[index].c_str());
    return S_OK;
}

STDMETHODIMP HostObjectMain::put_TestIndexedProperty(INT index, BSTR stringValue)
{
    m_testPropertyValues[index] = stringValue;
    return S_OK;
}

STDMETHODIMP HostObjectMain::GetTypeInfoCount(UINT* pctinfo)
{
    *pctinfo = 1;
    return S_OK;
}

STDMETHODIMP HostObjectMain::GetTypeInfo(UINT iTInfo, LCID lcid, ITypeInfo** ppTInfo)
{
    if (0 != iTInfo)
    {
        return TYPE_E_ELEMENTNOTFOUND;
    }
    if (!m_typeLib)
    {
        RETURN_IF_FAILED(LoadTypeLib(L"webapp_test.tlb", &m_typeLib));
    }
    return m_typeLib->GetTypeInfoOfGuid(__uuidof(IHostObjectMain), ppTInfo);
}

STDMETHODIMP HostObjectMain::GetIDsOfNames(
    REFIID riid, LPOLESTR* rgszNames, UINT cNames, LCID lcid, DISPID* rgDispId)
{
    wil::com_ptr<ITypeInfo> typeInfo;
    RETURN_IF_FAILED(GetTypeInfo(0, lcid, &typeInfo));
    return typeInfo->GetIDsOfNames(rgszNames, cNames, rgDispId);
}

STDMETHODIMP HostObjectMain::Invoke(
    DISPID dispIdMember, REFIID riid, LCID lcid, WORD wFlags, DISPPARAMS* pDispParams,
    VARIANT* pVarResult, EXCEPINFO* pExcepInfo, UINT* puArgErr)
{
    wil::com_ptr<ITypeInfo> typeInfo;
    RETURN_IF_FAILED(GetTypeInfo(0, lcid, &typeInfo));
    return typeInfo->Invoke(
        this, dispIdMember, wFlags, pDispParams, pVarResult, pExcepInfo, puArgErr);
}
