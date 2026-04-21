# WMS_Figma

## BLE Gateway Configuration

You can configure BLE gateways directly from the app UI:

1. Sign in and open **Master Data**.
2. Go to **BLE Infrastructure → BLE Gateways**.
3. Click **Add** and enter gateway details:
   - Gateway code/name
   - MAC address and IP
   - Gateway type (Fixed/Mobile/Handheld/Anchor)
   - Connection protocol and port (MQTT/HTTP/TCP)
   - Scan interval, heartbeat interval, and signal range
4. Use **Apply Recommended** in the form to auto-fill baseline values by gateway type.
5. Save and verify the gateway appears as **Online** when heartbeat updates are received.

The seed script also creates sample BLE gateways with protocol/port defaults to help you get started quickly.
