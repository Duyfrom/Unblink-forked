# Unblink Fork - macOS Compatibility Edition

This is a fork of the original Unblink project with improvements for running on macOS, particularly on Apple Silicon machines like the M4 MacBook Air.

Unblink is a camera monitoring application that runs AI vision models on your camera streams in real-time. It provides contextual understanding, object detection, intelligent search across video feeds, and sub-second video streaming.

## What This Fork Changes

This fork addresses critical compatibility issues when running Unblink on macOS:

1. **Startup Timeout Fix**: Adds a 5-second timeout to the engine version check. The original code would hang indefinitely if the remote Zapdos Labs engine was unreachable or if you had network connectivity issues.

2. **Non-Blocking Version Check**: Moves the engine version check to run in the background so the server can start immediately even if the engine is unavailable.

3. **Worker Error Handling**: Adds graceful error handling for worker message posting to prevent unhandled exceptions when the worker process crashes.

4. **Worker Crash Detection**: Improved logging when the worker process encounters errors, making it easier to diagnose issues.

## Original Project

This project is forked from the original Unblink repository. For the original source and more details, visit: https://github.com/tri2820/unblink

## System Requirements

- Bun runtime (https://bun.sh)
- Node.js compatible operating system (tested on macOS)
- FFmpeg for webcam streaming to MJPEG format
- Minimum 2GB RAM for smooth operation
- Internet connection (optional for AI features, required for remote Zapdos Labs engine)

### macOS Specific Requirements

- macOS 11 or later
- For M-series Macs: Built-in support via Bun
- FFmpeg can be installed via Homebrew: `brew install ffmpeg`

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Duyfrom/Unblink-forked.git
cd unblink
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start the Application

For full functionality (with worker stream processing):

```bash
bun dev
```

For lite mode (no stream processing worker - recommended on macOS):

```bash
DEV_MODE=lite bun dev
```

The application will be accessible at `http://localhost:3000`

### 4. Configure Your Camera Stream

Unblink supports RTSP, MJPEG, and other streaming protocols. For macOS webcam streaming, use FFmpeg to convert the native camera to MJPEG:

```bash
ffmpeg -f avfoundation -framerate 30 -i "0:" -c:v mjpeg -f mjpeg -listen 1 http://localhost:8081
```

This command:
- Uses macOS AVFoundation to access the built-in camera
- Sets 30 FPS framerate
- Streams as MJPEG format
- Listens on port 8081

### 5. Add Camera to Unblink

1. Open http://localhost:3000 in your browser
2. Go to Settings or Add Camera
3. Enter the camera URL: `http://localhost:8081`
4. Give it a name (e.g., "MacBook Camera")
5. Click Save

## Features

- Real-time object detection with the D-FINE model
- Vision-language model integration (SmolVLM2 and Moondream 3)
- Semantic search across video frames
- Webhook alerts for detections
- Role-based authentication
- Multi-camera dashboard
- Sub-second video streaming

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `HOSTNAME`: Server hostname (default: localhost)
- `ENGINE_URL`: Zapdos Labs engine URL (default: api.zapdoslabs.com)
- `DEV_MODE`: Set to "lite" to disable stream processing worker (recommended for macOS)
- `NODE_ENV`: Set to "development" for development mode

Example:

```bash
PORT=3000 HOSTNAME=0.0.0.0 DEV_MODE=lite bun dev
```

## Known Issues and Workarounds

### Worker Process Crashes on macOS

The main issue on macOS is that the Bun Worker process crashes when trying to use the `node-av` library. This happens because of incompatibilities between Bun's worker implementation and certain native modules.

**Symptom**: Application starts but gets stuck when you try to add a camera.

**Workaround**: Run Unblink in lite mode using `DEV_MODE=lite bun dev`. This disables the local stream processing worker and relies on the remote Zapdos Labs engine for AI processing.

### Lite Mode Limitations

When running in lite mode:
- Live camera streaming works normally
- Object detection works via the remote engine
- Vision-language model queries work via the remote engine
- Local frame processing and recording features are disabled
- The worker process is completely bypassed

This is actually the recommended way to run Unblink on macOS since the Zapdos Labs engine handles all the heavy AI lifting anyway.

### Network Connectivity

If you don't have internet access or the Zapdos Labs engine is unreachable, the application will still start (thanks to the non-blocking version check), but AI features will not work until connectivity is restored.

## Usage

Once the application is running and you have added a camera:

1. View live camera feeds on the dashboard
2. Use the VLM interface to ask questions about what's happening in your camera feeds
3. Search through captured frames using natural language queries
4. Configure webhooks to send alerts when objects are detected
5. Set up rules and automation (where available)

## Development

### Running Tests

```bash
bun test
```

### Building for Production

```bash
bun build.ts
```

### Admin Panel

To access administrative functions:

```bash
bun admin.ts
```

## Project Status

Feature status:
- Multi-camera Dashboard: Stable
- D-FINE Object Detection: Stable
- SmolVLM2 Integration: Stable
- Semantic Search: In Progress
- Video Recording and Playback: Coming Soon
- Motion Detection: Coming Soon
- ONVIF Support: Coming Soon
- Webhooks: Stable
- Automation: Coming Soon

## Acknowledgments

- Original project by Tri Nguyen Van
- Built with Bun runtime
- Uses the D-FINE model for object detection
- Uses SmolVLM2 and Moondream 3 for vision-language understanding
- Video streaming powered by node-av library

## Contributing

Contributions are welcome. If you find issues specific to this fork or have improvements for macOS compatibility, please submit a pull request or open an issue.

## License

See the LICENSE file in the repository for full details.

## Troubleshooting

### Application hangs during startup
- Check your internet connection
- Try running with `DEV_MODE=lite` to skip the network version check
- Check the logs for specific error messages

### Camera feed doesn't load
- Verify FFmpeg is streaming to http://localhost:8081
- Check that the camera URL is correctly entered in Unblink settings
- Ensure your Mac's camera permissions are granted to FFmpeg

### AI features not working
- Check your internet connection (required for Zapdos Labs engine)
- Verify the remote engine is accessible
- Check firewall settings

### High CPU usage
- Disable object detection from Settings if not needed
- Ensure you're using DEV_MODE=lite on macOS
