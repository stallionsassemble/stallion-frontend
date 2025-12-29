"use client";

import { authService } from "@/lib/api/auth";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const testProxy = async () => {
    log("Testing Proxy: POST /api/auth/login (expecting 400/401, not 404)");
    try {
      await axios.post('/api/auth/login', {});
      log("✅ Proxy Success (2xx - unlikely for empty body)");
    } catch (e: any) {
      log(`Proxy Result: Status ${e.response?.status} (${e.message})`);
      if (e.response?.status === 404) log("❌ Proxy Failed: 404 means Next.js handled it (rewrite failed)");
      else log("✅ Proxy Connected (Backend returned error)");
    }
  };

  const testDirectApi = async () => {
    log(`Testing Direct: POST ${backendUrl}/api/auth/login`);
    try {
      await authService.profile()
      log("✅ Direct API Success");
    } catch (e: any) {
      log(`Direct API Result: Status ${e.response?.status} (If 404, path is wrong)`);
    }
  };

  const testDirectNoApi = async () => {
    log(`Testing Direct (No /api): POST ${backendUrl}/auth/login`);
    try {
      await axios.post(`${backendUrl}/auth/login`, {});
      log("✅ Direct No-API Success");
    } catch (e: any) {
      log(`Direct No-API Result: Status ${e.response?.status} (If 404, path is wrong)`);
    }
  };

  return (
    <div className="p-10 text-white space-y-4">
      <h1 className="text-xl font-bold">Proxy Debugger</h1>
      <div>Backend URL: {backendUrl}</div>
      <div className="flex gap-4">
        <button onClick={testProxy} className="bg-blue-500 px-4 py-2 rounded">Test Proxy</button>
        <button onClick={testDirectApi} className="bg-green-500 px-4 py-2 rounded">Test Backend (/api)</button>
        <button onClick={testDirectNoApi} className="bg-orange-500 px-4 py-2 rounded">Test Backend (No /api)</button>
      </div>
      <pre className="bg-gray-900 p-4 rounded mt-4 text-sm font-mono h-64 overflow-auto">
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </pre>
    </div>
  );
}