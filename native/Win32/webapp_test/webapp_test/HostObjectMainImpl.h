// Copyright (C) Microsoft Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#pragma once

#include <functional>
#include <map>
#include <string>
#include <wrl\client.h>

#include "HostObjectMain_h.h"

class HostObjectMain : public Microsoft::WRL::RuntimeClass<
    Microsoft::WRL::RuntimeClassFlags<Microsoft::WRL::ClassicCom>,
    IHostObjectMain, IDispatch>
{
public:
    typedef std::function<void(void)> Callback;
    typedef std::function<void(Callback)> RunCallbackAsync;

    HostObjectMain(RunCallbackAsync runCallbackAsync);

    // IHostObjectMain implementation
    STDMETHODIMP MainInterface(BSTR stringParam, BSTR* stringRes) override;

    STDMETHODIMP TestCbAsyncWithStringAndInt(IDispatch* callbackParam) override;

    STDMETHODIMP TestMethodWithStringAndInt(BSTR stringParam, INT intParam) override;

    STDMETHODIMP get_TestProperty(BSTR* stringResult) override;
    STDMETHODIMP put_TestProperty(BSTR stringValue) override;
    STDMETHODIMP get_TestIndexedProperty(INT index, BSTR* stringResult) override;
    STDMETHODIMP put_TestIndexedProperty(INT index, BSTR stringValue) override;

    // IDispatch implementation
    STDMETHODIMP GetTypeInfoCount(UINT* pctinfo) override;

    STDMETHODIMP GetTypeInfo(UINT iTInfo, LCID lcid, ITypeInfo** ppTInfo) override;

    STDMETHODIMP GetIDsOfNames(
        REFIID riid, LPOLESTR* rgszNames, UINT cNames, LCID lcid, DISPID* rgDispId) override;

    STDMETHODIMP Invoke(
        DISPID dispIdMember, REFIID riid, LCID lcid, WORD wFlags, DISPPARAMS* pDispParams,
        VARIANT* pVarResult, EXCEPINFO* pExcepInfo, UINT* puArgErr) override;

private:
    std::wstring m_testPropertyValue;
    std::map<INT, std::wstring> m_testPropertyValues;
    wil::com_ptr<IDispatch> m_testCallback;
    RunCallbackAsync m_runCallbackAsync;
    wil::com_ptr<ITypeLib> m_typeLib;
};
