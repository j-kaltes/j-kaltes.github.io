    "use strict";


    (function installNewViewerHtmlForInAppViewer() {
      // The in-app HTML shipped in older app versions can load this hosted
      // viewer.js, but it does not contain the latest mobile/landscape layout
      // markup and CSS. Install the new HTML shell before the rest of this file
      // looks up elements by id. When this file is used by newviewer.html, this
      // block does nothing.
      const hasNewShell = Boolean(document.getElementById("toggleToolbarBtn")) &&
        Boolean(document.getElementById("glChart")) &&
        Boolean(document.getElementById("amountChart")) &&
        Boolean(document.getElementById("plotClip"));

      if (hasNewShell) return;

      const hasOldViewerShell = Boolean(document.getElementById("chart")) &&
        Boolean(document.getElementById("chartWrap")) &&
        Boolean(document.getElementById("baseUrl"));

      if (!hasOldViewerShell) return;

      const newHeadHtml = "\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n  <title>Juggluco Viewer</title>\n  <style>\n    :root {\n      --bg: #f6f7f9;\n      --panel: #ffffff;\n      --ink: #1b1f24;\n      --muted: #667085;\n      --border: #d0d5dd;\n      --accent: #2563eb;\n      --danger: #b42318;\n      --shadow: 0 10px 30px rgba(16, 24, 40, 0.08);\n    }\n\n    * { box-sizing: border-box; }\n\n    html,\n    body {\n      height: 100%;\n    }\n\n    @supports (height: 100dvh) {\n      html,\n      body {\n        height: 100dvh;\n      }\n    }\n\n    body {\n      margin: 0;\n      font-family: system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n      background: var(--bg);\n      color: var(--ink);\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      min-height: 100%;\n    }\n\n    header {\n      flex: 0 0 auto;\n      padding: 12px 20px 6px;\n    }\n\n    h1 {\n      margin: 0 0 4px;\n      font-size: 22px;\n      line-height: 1.2;\n    }\n\n    .subtitle {\n      margin: 0;\n      color: var(--muted);\n      font-size: 14px;\n    }\n\n    main {\n      flex: 1 1 auto;\n      min-height: 0;\n      padding: 0;\n      display: grid;\n      grid-template-columns: minmax(250px, 320px) minmax(0, 1fr);\n      gap: 0;\n    }\n\n    .panel {\n      background: var(--panel);\n      border: 1px solid var(--border);\n      border-radius: 0;\n      box-shadow: none;\n    }\n\n    .controls {\n      padding: 12px;\n      align-self: stretch;\n      min-height: 0;\n      overflow: auto;\n      overscroll-behavior: contain;\n    }\n\n    .options-header {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 10px;\n      margin-bottom: 12px;\n    }\n\n    .options-header strong {\n      font-size: 14px;\n    }\n\n    body.controls-collapsed main {\n      grid-template-columns: minmax(0, 1fr);\n    }\n\n    body.controls-collapsed .controls {\n      display: none;\n    }\n\n    .chart-panel {\n      min-width: 0;\n      min-height: 0;\n      align-self: stretch;\n      display: grid;\n      grid-template-rows: auto minmax(0, 1fr) auto;\n      overflow: hidden;\n      position: relative;\n    }\n\n    .chart-toolbar { grid-row: 1; }\n    .chart-wrap { grid-row: 2; }\n    .status { grid-row: 3; }\n\n    body.toolbar-collapsed .chart-panel {\n      grid-template-rows: minmax(0, 1fr) auto;\n    }\n\n    body.toolbar-collapsed .chart-wrap { grid-row: 1; }\n    body.toolbar-collapsed .status { grid-row: 2; }\n\n    .chart-toolbar {\n      position: relative;\n      display: flex;\n      flex-wrap: nowrap;\n      align-items: center;\n      justify-content: flex-start;\n      gap: 6px;\n      border-bottom: 1px solid var(--border);\n      padding: 6px 8px 6px 34px;\n      min-width: 0;\n    }\n\n    .chart-actions {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 6px;\n    }\n\n    .graph-actions {\n      flex: 1 1 auto;\n      min-width: 0;\n      flex-wrap: nowrap;\n      overflow-x: auto;\n      overflow-y: hidden;\n      -webkit-overflow-scrolling: touch;\n      scrollbar-width: none;\n    }\n\n    .graph-actions::-webkit-scrollbar {\n      display: none;\n    }\n\n    .graph-actions button {\n      flex: 0 0 auto;\n      white-space: nowrap;\n    }\n\n    #toggleOptionsBtn {\n      flex: 0 0 auto;\n      white-space: nowrap;\n    }\n\n    #toggleToolbarBtn {\n      position: absolute;\n      left: 0;\n      top: 8px;\n      z-index: 25;\n      width: 26px;\n      min-width: 0;\n      height: 34px;\n      padding: 0;\n      border-radius: 0 8px 8px 0;\n      background: rgba(255, 255, 255, 0.84);\n      backdrop-filter: blur(4px);\n      box-shadow: 0 4px 12px rgba(16, 24, 40, 0.12);\n      font-size: 16px;\n      line-height: 1;\n      text-align: center;\n      opacity: 0.88;\n    }\n\n    #toggleToolbarBtn:hover {\n      opacity: 1;\n    }\n\n    body.toolbar-collapsed .chart-toolbar {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      z-index: 20;\n      padding: 0;\n      border: 0;\n      background: transparent;\n      box-shadow: none;\n      pointer-events: none;\n    }\n\n    body.toolbar-collapsed .graph-actions,\n    body.toolbar-collapsed .summary {\n      display: none;\n    }\n\n    body.toolbar-collapsed #toggleToolbarBtn {\n      pointer-events: auto;\n    }\n\n    .summary {\n      flex: 0 1 auto;\n      min-width: 8em;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      color: var(--muted);\n      font-size: 13px;\n    }\n\n    .chart-wrap {\n      position: relative;\n      min-width: 0;\n      min-height: 0;\n      overflow: hidden;\n      background:\n        linear-gradient(180deg, rgba(37, 99, 235, 0.04), rgba(255, 255, 255, 0));\n    }\n\n    .chart-wrap canvas {\n      position: absolute;\n      inset: 0;\n      display: block;\n      width: 100%;\n      height: 100%;\n      touch-action: none;\n    }\n\n    .plot-clip {\n      position: absolute;\n      z-index: 1;\n      overflow: hidden;\n      pointer-events: none;\n      background: #ffffff;\n      contain: strict;\n    }\n\n    #glChart {\n      z-index: 1;\n      background: #ffffff;\n      will-change: transform;\n      transform: translate3d(0, 0, 0);\n      pointer-events: none;\n      inset: auto;\n    }\n\n    #amountChart {\n      z-index: 2;\n      background: transparent;\n      will-change: transform;\n      transform: translate3d(0, 0, 0);\n      pointer-events: none;\n      inset: auto;\n    }\n\n    #chart {\n      z-index: 3;\n      cursor: grab;\n      background: transparent;\n    }\n\n    #chart.dragging {\n      cursor: grabbing;\n    }\n\n    .tooltip {\n      position: absolute;\n      display: none;\n      pointer-events: none;\n      z-index: 5;\n      max-width: 280px;\n      padding: 8px 10px;\n      border-radius: 10px;\n      background: rgba(17, 24, 39, 0.94);\n      color: white;\n      font-size: 12px;\n      line-height: 1.35;\n      box-shadow: 0 10px 20px rgba(0,0,0,.25);\n      white-space: normal;\n    }\n\n    .status {\n      display: none;\n      padding: 10px 14px;\n      min-height: 42px;\n      color: var(--muted);\n      border-top: 1px solid var(--border);\n      font-size: 13px;\n    }\n\n    .status.error {\n      display: block;\n      color: var(--danger);\n    }\n\n    fieldset {\n      margin: 0 0 16px;\n      padding: 12px;\n      border: 1px solid var(--border);\n      border-radius: 12px;\n    }\n\n    legend {\n      padding: 0 6px;\n      color: var(--muted);\n      font-size: 13px;\n      font-weight: 700;\n    }\n\n    label {\n      display: block;\n      margin: 0 0 10px;\n      font-size: 13px;\n      color: var(--ink);\n    }\n\n    label.inline {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      margin-bottom: 8px;\n    }\n\n    input[type=\"text\"],\n    input[type=\"number\"],\n    input[type=\"password\"],\n    input[type=\"date\"],\n    input[type=\"time\"],\n    select {\n      width: 100%;\n      margin-top: 4px;\n      padding: 9px 10px;\n      border: 1px solid var(--border);\n      border-radius: 10px;\n      background: white;\n      color: var(--ink);\n      font: inherit;\n      font-size: 14px;\n    }\n\n    input[type=\"checkbox\"] {\n      width: 16px;\n      height: 16px;\n      margin: 0;\n    }\n\n    .row {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 10px;\n    }\n\n    button {\n      appearance: none;\n      border: 1px solid var(--border);\n      background: white;\n      color: var(--ink);\n      padding: 7px 9px;\n      border-radius: 9px;\n      font-weight: 650;\n      cursor: pointer;\n      font-size: 14px;\n    }\n\n    button:hover {\n      border-color: #98a2b3;\n      background: #f9fafb;\n    }\n\n    button.primary {\n      background: var(--accent);\n      border-color: var(--accent);\n      color: white;\n    }\n\n    button.primary:hover {\n      filter: brightness(.96);\n    }\n\n    .hint {\n      color: var(--muted);\n      font-size: 12px;\n      line-height: 1.45;\n      margin: 8px 0 0;\n    }\n\n    .legend-list {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 10px;\n      margin-top: 8px;\n    }\n\n    .legend-item {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      color: var(--muted);\n      font-size: 12px;\n    }\n\n    .swatch {\n      display: inline-block;\n      width: 18px;\n      height: 3px;\n      border-radius: 4px;\n      background: #111;\n    }\n\n    .dashed-swatch {\n      background: repeating-linear-gradient(\n        90deg,\n        currentColor 0 5px,\n        transparent 5px 8px\n      ) !important;\n      color: #9333ea;\n    }\n\n    .dot {\n      width: 9px;\n      height: 9px;\n      border-radius: 999px;\n    }\n\n    @media (max-width: 900px) {\n      main {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-rows: auto minmax(0, 1fr);\n        padding: 0;\n        gap: 0;\n      }\n\n      body.controls-collapsed main {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-rows: minmax(0, 1fr);\n      }\n\n      .controls {\n        max-height: min(42dvh, 360px);\n      }\n\n      .chart-panel {\n        min-height: 0;\n      }\n\n      .chart-toolbar {\n        padding: 5px 5px 5px 31px;\n      }\n\n      .summary {\n        display: none;\n      }\n    }\n\n    @media (max-width: 900px) and (orientation: landscape) and (min-width: 640px),\n           (max-height: 560px) and (min-width: 640px) {\n      main {\n        grid-template-columns: clamp(204px, 29vw, 276px) minmax(0, 1fr);\n        grid-template-rows: minmax(0, 1fr);\n      }\n\n      body.controls-collapsed main {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-rows: minmax(0, 1fr);\n      }\n\n      .controls {\n        max-height: none;\n        padding: 8px;\n      }\n\n      fieldset {\n        margin-bottom: 8px;\n        padding: 8px;\n      }\n\n      label {\n        margin-bottom: 7px;\n      }\n\n      input[type=\"text\"],\n      input[type=\"number\"],\n      input[type=\"password\"],\n      input[type=\"date\"],\n      input[type=\"time\"],\n      select {\n        padding: 6px 8px;\n        font-size: 13px;\n      }\n    }\n\n    @media (max-width: 520px) {\n      .chart-toolbar {\n        gap: 4px;\n      }\n\n      .graph-actions {\n        gap: 4px;\n      }\n\n      .graph-actions button {\n        padding-left: 8px;\n        padding-right: 8px;\n      }\n    }\n\n    @media (max-height: 560px) {\n      main {\n        padding: 0;\n        gap: 0;\n      }\n\n      .panel {\n        border-radius: 5px;\n        box-shadow: none;\n      }\n\n      .chart-panel {\n        border-left-width: 0;\n        border-right-width: 0;\n      }\n\n      .chart-toolbar {\n        padding: 3px 4px 3px 30px;\n      }\n\n      #toggleToolbarBtn {\n        top: 4px;\n        width: 24px;\n        height: 30px;\n        border-radius: 0 7px 7px 0;\n        font-size: 14px;\n      }\n\n      button {\n        padding: 5px 7px;\n        border-radius: 7px;\n        font-size: 12px;\n      }\n\n      .summary {\n        display: none;\n      }\n    }\n  </style>\n";
      const newBodyHtml = "\n  <main>\n    <section class=\"panel controls\" aria-label=\"Controls\">\n      <div class=\"options-header\">\n        <strong class=\"options-title\">Options</strong>\n      </div>\n      <fieldset>\n        <legend>Connection</legend>\n\n        <label>\n          Juggluco server URL\n          <input id=\"baseUrl\" type=\"text\" value=\"http://127.0.0.1:17580\"\n                 placeholder=\"http://127.0.0.1:17580 or http://192.168.1.69:17580\" />\n        </label>\n\n        <label>\n          API token / api_secret, optional\n          <input id=\"token\" type=\"password\" autocomplete=\"off\"\n                 placeholder=\"Leave empty if not used\" />\n        </label>\n        <label class=\"inline\"><input id=\"showToken\" type=\"checkbox\" /> Show api_secret</label>\n\n        <div class=\"row\">\n          <label>\n            Unit\n            <select id=\"unit\">\n              <option value=\"mmol/L\" selected>mmol/L</option>\n              <option value=\"mg/dL\">mg/dL</option>\n            </select>\n          </label>\n\n          <label>\n            Window\n            <select id=\"windowHours\">\n              <option value=\"3\">3 hours</option>\n              <option value=\"6\" selected>6 hours</option>\n              <option value=\"12\">12 hours</option>\n              <option value=\"24\">24 hours</option>\n              <option value=\"48\">48 hours</option>\n              <option value=\"168\">7 days</option>\n            </select>\n          </label>\n        </div>\n\n        <div class=\"row\">\n          <label>\n            Start date\n            <input id=\"dateToView\" type=\"date\" />\n          </label>\n\n          <label>\n            Start time\n            <input id=\"timeOnDate\" type=\"time\" value=\"00:00\" />\n          </label>\n        </div>\n\n        <div class=\"chart-actions\" style=\"margin-bottom:10px\">\n          <button id=\"goDateBtn\" type=\"button\">Go to start</button>\n          <button id=\"todayDateBtn\" type=\"button\">Today 00:00</button>\n        </div>\n\n        <button id=\"loadBtn\" class=\"primary\" type=\"button\">Load data</button>\n        <p class=\"hint\">\n          The start date/time is the left edge of the graph. The Window setting determines\n          how much time is shown from that start. Use the buttons, mouse wheel, drag, or arrow keys to move through time.\n        </p>\n      </fieldset>\n\n      <fieldset>\n        <legend>Display</legend>\n\n        <label class=\"inline\"><input id=\"showStream\" type=\"checkbox\" checked /> Stream curve</label>\n        <label class=\"inline\"><input id=\"showScans\" type=\"checkbox\" checked /> Libre scans as dots</label>\n        <label class=\"inline\"><input id=\"showHistory\" type=\"checkbox\" /> History values</label>\n        <label class=\"inline\"><input id=\"showAmounts\" type=\"checkbox\" checked /> Entered amounts</label>\n        <label class=\"inline\"><input id=\"useCalibrated\" type=\"checkbox\" checked /> Calibrated</label>\n        <label class=\"inline\"><input id=\"autoRefresh\" type=\"checkbox\" checked /> Auto-refresh when viewing latest data</label>\n\n        <div class=\"row\">\n          <label>\n            Low line\n            <input id=\"lowLimit\" type=\"number\" step=\"0.1\" value=\"3.9\" />\n          </label>\n          <label>\n            High line\n            <input id=\"highLimit\" type=\"number\" step=\"0.1\" value=\"10.0\" />\n          </label>\n        </div>\n\n        <div class=\"row\">\n          <label>\n            Graph min\n            <input id=\"graphMin\" type=\"number\" step=\"0.5\" value=\"2\" />\n          </label>\n          <label>\n            Graph max\n            <input id=\"graphMax\" type=\"number\" step=\"0.5\" value=\"11\" />\n          </label>\n        </div>\n\n        <div class=\"row\">\n          <label>\n            Curve thickness\n            <input id=\"curveThickness\" type=\"number\" min=\"1\" max=\"12\" step=\"0.5\" value=\"2\" />\n          </label>\n        </div>\n\n        <p class=\"hint\">\n          The graph min/max is the normal vertical range. The graph expands only when\n          visible values or limit lines fall outside that range. The curve uses the sharp\n          WebGL render path and quietly prefetches neighboring time ranges while you scroll.\n        </p>\n      </fieldset>\n\n      <fieldset>\n        <legend>Legend</legend>\n        <p class=\"hint\">\n          Colors identify sensors. Shape and line style identify the data source.\n        </p>\n        <div class=\"legend-list\">\n          <span class=\"legend-item\"><span class=\"swatch\" style=\"background:#2563eb\"></span>Stream: solid line</span>\n          <span class=\"legend-item\"><span class=\"dot\" style=\"background:#2563eb\"></span>Scans: dots</span>\n          <span class=\"legend-item\"><span class=\"swatch\" style=\"background:#9333ea\"></span>History: solid line</span>\n          <span class=\"legend-item\"><span class=\"dot\" style=\"background:#047857\"></span>Amounts: green tags</span>\n        </div>\n        <p class=\"hint\" style=\"margin-top:12px\">Sensors in the loaded data:</p>\n        <div id=\"sensorLegend\" class=\"legend-list\">\n          <span class=\"legend-item\">No sensors loaded yet.</span>\n        </div>\n      </fieldset>\n\n      <fieldset>\n        <legend>Keyboard</legend>\n        <p class=\"hint\">\n          \u2190 / \u2192 pan half a window. + / \u2212 zoom. Home jumps to now.\n        </p>\n      </fieldset>\n    </section>\n\n    <section class=\"panel chart-panel\" aria-label=\"Glucose chart\">\n      <div class=\"chart-toolbar\">\n        <button id=\"toggleToolbarBtn\" type=\"button\" title=\"Hide buttons\" aria-label=\"Hide buttons\">\u25b4</button>\n        <div class=\"chart-actions graph-actions\">\n          <button id=\"toggleOptionsBtn\" type=\"button\">Hide options</button>\n          <button id=\"prevBtn\" type=\"button\" title=\"Back\" aria-label=\"Back\">\u25c0</button>\n          <button id=\"nextBtn\" type=\"button\" title=\"Forward\" aria-label=\"Forward\">\u25b6</button>\n          <button id=\"zoomInBtn\" type=\"button\" title=\"Zoom in\" aria-label=\"Zoom in\">+</button>\n          <button id=\"zoomOutBtn\" type=\"button\" title=\"Zoom out\" aria-label=\"Zoom out\">\u2212</button>\n          <button id=\"nowBtn\" type=\"button\">Now</button>\n        </div>\n        <div id=\"summary\" class=\"summary\">No data loaded yet.</div>\n      </div>\n\n      <div class=\"chart-wrap\" id=\"chartWrap\">\n        <div id=\"plotClip\" class=\"plot-clip\" aria-hidden=\"true\">\n          <canvas id=\"glChart\"></canvas>\n          <canvas id=\"amountChart\"></canvas>\n        </div>\n        <canvas id=\"chart\" aria-label=\"Glucose graph\"></canvas>\n        <div id=\"tooltip\" class=\"tooltip\"></div>\n      </div>\n\n      <div id=\"status\" class=\"status\" role=\"alert\"></div>\n    </section>\n  </main>\n";

      document.head.innerHTML = newHeadHtml;
      document.body.innerHTML = newBodyHtml;
    }());

    const COLORS = {
      grid: "#e5e7eb",
      text: "#475467",
      textStrong: "#1f2937",
      stream: "#2563eb",
      scans: "#dc2626",
      history: "#9333ea",
      amounts: "#047857",
      lowHigh: "#f59e0b",
      targetFill: "rgba(16, 185, 129, 0.08)",
      background: "#ffffff"
    };

    const SENSOR_PALETTE = [
      "#2563eb", "#dc2626", "#9333ea", "#ea580c",
      "#0891b2", "#7c3aed", "#16a34a", "#be123c",
      "#0f766e", "#4f46e5", "#a16207", "#c026d3"
    ];

    const state = {
      centerMs: Date.now(),
      windowMs: 6 * 60 * 60 * 1000,
      unit: "mmol/L",
      data: {
        stream: [],
        scans: [],
        history: [],
        amounts: []
      },
      cache: {
        streamGroups: [],
        historyGroups: [],
        allGlucoseSorted: [],
        sensorStats: [],
        loadedStartMs: null,
        loadedEndMs: null
      },
      loading: false,
      fetchController: null,
      fetchTimer: null,
      pendingQuietLoad: false,
      drawRequested: false,
      dateInputTimer: null,
      viewportUiTimer: null,
      pendingWheelPan: 0,
      wheelPanRequested: false,
      resize: { width: 0, height: 0, dpr: 0, glDpr: 0 },
      drag: null,
      hover: null,
      lastFetchKey: "",
      autoTimer: null,
      lastAutoRefreshFetchMs: 0,
      fastDrawTimer: null,
      drawFastOnly: false,
      lastYDomain: null,
      scrollRenderBaseCenterMs: null,
      scrollTransformPx: 0,
      webglOverscanWindows: 3,
      controlsCollapsed: false,
      toolbarCollapsed: false,
      liveFollowNow: true
    };

    const $ = id => document.getElementById(id);

    const els = {
      plotClip: $("plotClip"),
      glCanvas: $("glChart"),
      amountCanvas: $("amountChart"),
      canvas: $("chart"),
      chartWrap: $("chartWrap"),
      tooltip: $("tooltip"),
      status: $("status"),
      summary: $("summary"),
      sensorLegend: $("sensorLegend"),
      baseUrl: $("baseUrl"),
      token: $("token"),
      showToken: $("showToken"),
      unit: $("unit"),
      windowHours: $("windowHours"),
      dateToView: $("dateToView"),
      timeOnDate: $("timeOnDate"),
      goDateBtn: $("goDateBtn"),
      todayDateBtn: $("todayDateBtn"),
      lowLimit: $("lowLimit"),
      highLimit: $("highLimit"),
      graphMin: $("graphMin"),
      graphMax: $("graphMax"),
      curveThickness: $("curveThickness"),
      loadBtn: $("loadBtn"),
      prevBtn: $("prevBtn"),
      nextBtn: $("nextBtn"),
      zoomInBtn: $("zoomInBtn"),
      zoomOutBtn: $("zoomOutBtn"),
      nowBtn: $("nowBtn"),
      toggleOptionsBtn: $("toggleOptionsBtn"),
      toggleToolbarBtn: $("toggleToolbarBtn"),
      showStream: $("showStream"),
      showScans: $("showScans"),
      showHistory: $("showHistory"),
      showAmounts: $("showAmounts"),
      useCalibrated: $("useCalibrated"),
      autoRefresh: $("autoRefresh")
    };

    const ctx = els.canvas.getContext("2d", { alpha: true });
    const amountCtx = els.amountCanvas.getContext("2d", { alpha: true });
    let glRenderer = null;

/*    function normalizeBaseUrl(value) {
      const raw = String(value || "").trim();
      if (!raw) throw new Error("Please enter the Juggluco server URL.");
      return raw.replace(/\/+$/, "");
    } */
    function normalizeBaseUrl(value) {
      const raw = String(value || "").trim();
      return (raw || window.location.origin).replace(/\/+$/, "");
      }
    function unixSeconds(ms) {
      return Math.floor(ms / 1000);
    }

    function currentRange() {
      const half = state.windowMs / 2;
      return {
        startMs: state.centerMs - half,
        endMs: state.centerMs + half
      };
    }

    function bufferedFetchRange() {
      const { startMs, endMs } = currentRange();
      const hour = 60 * 60 * 1000;
      const day = 24 * hour;

      // Fetch well beyond the visible window. The WebGL renderer can now scroll
      // quickly enough that the viewport may otherwise outrun the TSV buffer and
      // briefly show an empty plot while the server catches up. Five windows of
      // padding gives smooth wheel/drag prefetching without making normal 3-24 h
      // views expensive. The cap keeps 7-day views from requesting excessive data.
      const paddingMs = Math.min(Math.max(state.windowMs * 5, 6 * hour), 14 * day);

      return {
        startMs: startMs - paddingMs,
        endMs: endMs + paddingMs,
        visibleStartMs: startMs,
        visibleEndMs: endMs
      };
    }

    function isVisibleRangeInCache(marginFraction = 0.10) {
      if (state.cache.loadedStartMs === null || state.cache.loadedEndMs === null) return false;

      const { startMs, endMs } = currentRange();
      const marginMs = state.windowMs * marginFraction;

      return startMs >= state.cache.loadedStartMs + marginMs &&
             endMs <= state.cache.loadedEndMs - marginMs;
    }

    function isCurrentVisibleRangeLoaded(extraWindowFraction = 0) {
      if (state.cache.loadedStartMs === null || state.cache.loadedEndMs === null) return false;

      const { startMs, endMs } = currentRange();
      const extraMs = state.windowMs * extraWindowFraction;

      return startMs - extraMs >= state.cache.loadedStartMs &&
             endMs + extraMs <= state.cache.loadedEndMs;
    }

    function shouldPrefetchSoon() {
      // Start fetching before the visible window reaches the edge of the loaded
      // data. This prevents the composited pan from sliding into an empty cache.
      return !isVisibleRangeInCache(1.5);
    }

    function clearLoadedCacheRange() {
      state.cache.loadedStartMs = null;
      state.cache.loadedEndMs = null;
    }

    function cacheDescription() {
      if (state.cache.loadedStartMs === null || state.cache.loadedEndMs === null) {
        return "no cached range";
      }
      return `cached ${formatDateTime(state.cache.loadedStartMs)} – ${formatDateTime(state.cache.loadedEndMs)}`;
    }

    function dataTimeBounds() {
      let min = Infinity;
      let max = -Infinity;

      function include(points) {
        for (const p of points || []) {
          if (!p || !Number.isFinite(p.t)) continue;
          min = Math.min(min, p.t);
          max = Math.max(max, p.t);
        }
      }

      include(state.data.stream);
      include(state.data.scans);
      include(state.data.history);
      include(state.data.amounts);

      if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
      return { min, max };
    }

    function clampCenterToDataBounds(centerMs = state.centerMs) {
      const bounds = dataTimeBounds();
      if (!bounds) return centerMs;

      const half = state.windowMs / 2;
      const minCenter = bounds.min - half;
      const maxCenter = bounds.max + half;

      if (maxCenter < minCenter) return centerMs;
      return Math.max(minCenter, Math.min(maxCenter, centerMs));
    }

    function applyDataScrollBounds() {
      const clamped = clampCenterToDataBounds(state.centerMs);
      const changed = Math.abs(clamped - state.centerMs) > 0.5;
      state.centerMs = clamped;
      return changed;
    }

    function requestFullDrawAfterLayout() {
      state.lastYDomain = null;
      state.scrollRenderBaseCenterMs = null;
      resetPlotTransform();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (state.liveFollowNow) {
            alignLiveFollowViewport();
            updateDateInputsNow();
            updateSummary();
          }

          // Direct draw avoids being coalesced behind a pending fast WebGL redraw.
          draw();
        });
      });
    }

    function isNearNow() {
      const { endMs } = currentRange();
      // Treat the view as "live" while its right edge is near the current
      // time. This lets auto-refresh keep following now even if the display is
      // a few minutes behind between sensor updates.
      const toleranceMs = Math.max(15 * 60 * 1000, state.windowMs * 0.20);
      return Math.abs(endMs - Date.now()) <= toleranceMs;
    }

    function isCurrentTimeInOrNearView() {
      const { startMs, endMs } = currentRange();
      const now = Date.now();
      const toleranceMs = Math.max(15 * 60 * 1000, Math.min(state.windowMs * 0.20, 60 * 60 * 1000));
      return now >= startMs - toleranceMs && now <= endMs + toleranceMs;
    }

    function setLiveFollowNow(enabled) {
      state.liveFollowNow = Boolean(enabled);
    }

    function leaveLiveFollowNow() {
      state.liveFollowNow = false;
    }

    function formatTime(ms) {
      const d = new Date(ms);
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }

    function formatDate(ms, options = {}) {
      return new Date(ms).toLocaleDateString([], options);
    }

    function formatDateTime(ms) {
      const date = formatDate(ms, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return `${date}, ${formatTime(ms)}`;
    }

    function isSameLocalDay(aMs, bMs = Date.now()) {
      const a = new Date(aMs);
      const b = new Date(bMs);
      return a.getFullYear() === b.getFullYear() &&
             a.getMonth() === b.getMonth() &&
             a.getDate() === b.getDate();
    }

    function formatMeasurementTimestamp(ms) {
      if (isSameLocalDay(ms)) {
        return formatTime(ms);
      }

      const date = formatDate(ms, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return `${date}, ${formatTime(ms)}`;
    }

    function localDateValue(ms = Date.now()) {
      const d = new Date(ms);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function localTimeValue(ms = Date.now()) {
      const d = new Date(ms);
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }

    function setDateInputsFromRangeStart() {
      const { startMs } = currentRange();
      els.dateToView.value = localDateValue(startMs);
      els.timeOnDate.value = localTimeValue(startMs);
    }

    function getSelectedDateTimeMs() {
      const date = els.dateToView.value || localDateValue();
      const time = els.timeOnDate.value || "00:00";
      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      return new Date(
        year,
        month - 1,
        day,
        Number.isFinite(hour) ? hour : 12,
        Number.isFinite(minute) ? minute : 0,
        0,
        0
      ).getTime();
    }

    function niceNumber(value, digits = 1) {
      if (!Number.isFinite(value)) return "";
      return value.toFixed(digits).replace(/\.0$/, "");
    }

    function formatGlucoseValue(value) {
      if (!Number.isFinite(value)) return "";
      return state.unit === "mg/dL" ? value.toFixed(0) : value.toFixed(1);
    }

    function parseNumber(value) {
      const n = Number(String(value || "").replace(",", "."));
      return Number.isFinite(n) ? n : NaN;
    }

    function cleanViewerTokenPath(pathname) {
      let path = String(pathname || "");
      try { path = decodeURIComponent(path); } catch {}
      path = path.replace(/^\/+|\/+$/g, "");
      // Remove the viewer filename itself. With the old regexp, "/viewer.html"
      // became "viewer.html", so a self-hosted viewer without an api_secret
      // showed "viewer.html" in the api_secret field.
      path = path.replace(/(?:^|\/)(?:inapp)?viewer\.html$/i, "");
      path = path.replace(/\/+$/g, "");
      return path;
    }

    function getViewerPathConfig() {
      const token = cleanViewerTokenPath(window.location.pathname);
      if (!token) return null;
      return {
        baseUrl: window.location.origin,
        token
      };
    }

    function getUrlStartConfig() {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("urlstart");

      if (raw) {
        const valuesToTry = [raw];
        try {
          const decoded = decodeURIComponent(raw);
          if (decoded !== raw) valuesToTry.push(decoded);
        } catch {}

        for (const value of valuesToTry) {
          try {
            const url = new URL(value, window.location.href);
            const token = cleanViewerTokenPath(url.pathname);
            return {
              baseUrl: url.origin,
              token
            };
          } catch {}
        }
      }

      // Also support opening the in-app viewer itself as /api_secret/viewer.html.
      // This makes https://host:port/secret/viewer.html work even when urlstart
      // is absent, ignored, or mangled by an old wrapper/link.
      return getViewerPathConfig();
    }

    function applyUrlStartConfig() {
      const config = getUrlStartConfig();

      if (!config) return false;

      if (config.baseUrl) els.baseUrl.value = config.baseUrl;
      els.token.value = config.token || "";
      return true;
    }

    function curveThicknessPx() {
      const value = parseNumber(els.curveThickness?.value);
      if (!Number.isFinite(value)) return 2;
      return Math.max(1, Math.min(12, value));
    }

    function curveResolutionScale() {
      // The user-validated sweet spot: sharp enough to look like the native
      // Juggluco curve, without the Retina/full-DPR fullscreen cost.
      return 1.5;
    }

    function currentLabelFontSize(area) {
      // Keep the phone annotation readable: the value should dominate the
      // direction arrow, not the other way around.
      // The arrow proportions stay unchanged; the value itself is about 1.5x larger.
      if (area.width < 380 || area.height < 230) return 45;
      if (area.width < 520 || area.height < 300) return 60;
      return 82;
    }

    function estimatedCurrentLabelRequiredPx(area) {
      // Keep enough empty plot space to the right of the newest stream point for
      // the native-style rate arrow and current glucose value. Use a smaller
      // reservation on phones, otherwise the annotation consumes too much of the
      // horizontal glucose history in portrait mode.
      const fontSize = currentLabelFontSize(area);
      const sampleText = state.unit === "mg/dL" ? "000" : "00.0";
      let textWidth = Math.max(60, fontSize * 2.2);

      try {
        ctx.save();
        ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        textWidth = ctx.measureText(sampleText).width;
        ctx.restore();
      } catch {}

      const compact = area.width < 520 || area.height < 300;
      const arrowSpace = compact ? 29 : 58;
      const rightPad = compact ? 4 : 8;
      const safetyPad = compact ? 6 : 14;
      const minPad = compact ? 72 : 120;
      const maxFraction = compact ? 0.34 : 0.45;
      return Math.min(area.w * maxFraction, Math.max(minPad, textWidth + arrowSpace + rightPad + safetyPad));
    }

    function liveFollowCenterMs(now = Date.now()) {
      const rect = els.chartWrap?.getBoundingClientRect?.();
      const width = Math.max(180, Math.floor(
        rect?.width || state.resize.width || els.canvas?.clientWidth || window.innerWidth || 900
      ));
      const height = Math.max(80, Math.floor(
        rect?.height || state.resize.height || els.canvas?.clientHeight || 420
      ));
      const area = plotAreaFromSize(width, height);
      const padPx = estimatedCurrentLabelRequiredPx(area);
      const padFraction = Math.max(0.12, Math.min(0.45, padPx / Math.max(1, area.w)));

      // currentRange() is centered on state.centerMs, so adding padFraction of
      // the window makes the right edge extend beyond now by exactly the screen
      // space reserved for the current-value annotation.
      return now - state.windowMs / 2 + state.windowMs * padFraction;
    }

    function alignLiveFollowViewport(now = Date.now()) {
      if (!state.liveFollowNow) return false;
      const nextCenterMs = liveFollowCenterMs(now);
      const changed = Math.abs(nextCenterMs - state.centerMs) > 0.5;
      state.centerMs = nextCenterMs;
      return changed;
    }

    function makeUrl(endpoint, flags = [], range = currentRange()) {
      const base = normalizeBaseUrl(els.baseUrl.value);
      const { startMs, endMs } = range;

      const query = [
        "header",
        ...flags,
        `starttime=${unixSeconds(startMs)}`,
        `endtime=${unixSeconds(endMs)}`
      ];

      const token = els.token.value.trim();
      if (token) query.push(`token=${encodeURIComponent(token)}`);

      return `${base}/x/${endpoint}?${query.join("&")}`;
    }

    async function fetchText(url, signal) {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        mode: "cors",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${url}`);
      }

      return response.text();
    }

    function parseTsv(text) {
      const lines = String(text || "")
        .split(/\r?\n/)
        .filter(line => line.trim().length > 0);

      if (!lines.length) return [];

      const header = lines[0].split("\t").map(h => h.trim());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split("\t");
        const row = {};
        for (let j = 0; j < header.length; j++) {
          row[header[j]] = parts[j] ?? "";
        }
        rows.push(row);
      }

      return rows;
    }

    function pickGlucoseColumn(row) {
      const keys = Object.keys(row);
      const has = key => Object.prototype.hasOwnProperty.call(row, key);
      const unitPattern = state.unit === "mg/dL" ? /mg\/dL/i : /mmol\/L/i;

      // Juggluco can return both raw and calibrated glucose columns. When the
      // calibrated option is enabled, use a calibrated unit column for both
      // drawing and tooltip hit-testing so hover values match the curve and the
      // current-value annotation.
      if (els.useCalibrated?.checked) {
        const calibratedUnit = keys.find(k => /calibrat/i.test(k) && unitPattern.test(k));
        if (calibratedUnit) return calibratedUnit;

        const calibratedAnyUnit = keys.find(k => /calibrat/i.test(k) && /mmol\/L|mg\/dL/i.test(k));
        if (calibratedAnyUnit) return calibratedAnyUnit;
      }

      if (has(state.unit)) return state.unit;
      if (has("mmol/L")) return "mmol/L";
      if (has("mg/dL")) return "mg/dL";

      const candidate = keys.find(k => /mmol\/L|mg\/dL/i.test(k));
      return candidate || null;
    }

    function parseGlucoseRows(text, type) {
      return parseTsv(text).map(row => {
        const glucoseColumn = pickGlucoseColumn(row);
        const t = parseNumber(row.UnixTime) * 1000;
        const y = glucoseColumn ? parseNumber(row[glucoseColumn]) : NaN;
        const raw = row.Raw !== undefined ? parseNumber(row.Raw) : NaN;
        const rate = row.Rate !== undefined ? parseNumber(row.Rate) : NaN;
        return {
          type,
          t,
          y,
          raw,
          rate,
          sensor: row.Sensorid || "",
          nr: row.nr || row.Nr || "",
          label: row.ChangeLabel || "",
          display: `${formatGlucoseValue(y)} ${state.unit}`
        };
      }).filter(p => Number.isFinite(p.t) && Number.isFinite(p.y))
        .sort((a, b) => a.t - b.t);
    }

    function parseAmountRows(text) {
      return parseTsv(text).map(row => {
        const t = parseNumber(row.UnixTime) * 1000;
        const value = parseNumber(row.Value);
        const label = row.Label || "Amount";

        return {
          type: "amount",
          t,
          value,
          label,
          source: row.Source || "",
          nr: row.nr || row.Nr || "",
          display: `${niceNumber(value, 1)} ${label}`
        };
      }).filter(p => Number.isFinite(p.t) && Number.isFinite(p.value))
        .sort((a, b) => a.t - b.t);
    }

    function setStatus(message, isError = false) {
      if (!isError) {
        els.status.textContent = "";
        els.status.classList.remove("error");
        return;
      }

      els.status.textContent = message;
      els.status.classList.add("error");
    }

    function visibleSettings() {
      return {
        stream: els.showStream.checked,
        scans: els.showScans.checked,
        history: els.showHistory.checked,
        amounts: els.showAmounts.checked,
        calibrated: els.useCalibrated.checked
      };
    }

    async function loadData(options = {}) {
      const force = options.force !== false;
      const quiet = Boolean(options.quiet);
      const cacheMargin = Number.isFinite(options.cacheMargin) ? options.cacheMargin : 0.10;

      clearTimeout(state.fetchTimer);
      state.fetchTimer = null;

      if (!force && isVisibleRangeInCache(cacheMargin)) {
        if (!quiet) setStatus(`Using cached data; ${cacheDescription()}.`);
        return;
      }

      // Do not abort and restart quiet prefetches during a continuous scroll.
      // Abort/restart loops are a common cause of the chart briefly going empty
      // because no request is ever allowed to finish. Explicit user actions still
      // use force=true and replace the in-flight request.
      if (state.loading && !force) {
        state.pendingQuietLoad = true;
        return;
      }

      if (state.fetchController) {
        state.fetchController.abort();
        state.fetchController = null;
      }

      const controller = new AbortController();
      state.fetchController = controller;
      state.loading = true;
      els.loadBtn.disabled = true;
      if (!quiet) setStatus("Loading buffered data from Juggluco…");

      try {
        state.unit = els.unit.value;
        state.windowMs = Number(els.windowHours.value) * 60 * 60 * 1000;

        const fetchRange = bufferedFetchRange();
        const settings = visibleSettings();
        const glucoseFlags = [state.unit];
        if (settings.calibrated) glucoseFlags.push("calibrated");

        const requests = [];

        if (settings.stream) {
          requests.push(fetchText(makeUrl("stream", glucoseFlags, fetchRange), controller.signal).then(t => {
            state.data.stream = parseGlucoseRows(t, "stream");
          }));
        } else {
          state.data.stream = [];
        }

        if (settings.scans) {
          requests.push(fetchText(makeUrl("scans", glucoseFlags, fetchRange), controller.signal).then(t => {
            state.data.scans = parseGlucoseRows(t, "scan");
          }));
        } else {
          state.data.scans = [];
        }

        if (settings.history) {
          requests.push(fetchText(makeUrl("history", glucoseFlags, fetchRange), controller.signal).then(t => {
            state.data.history = parseGlucoseRows(t, "history");
          }));
        } else {
          state.data.history = [];
        }

        if (settings.amounts) {
          requests.push(fetchText(makeUrl("amounts", [], fetchRange), controller.signal).then(t => {
            state.data.amounts = parseAmountRows(t);
          }));
        } else {
          state.data.amounts = [];
        }

        await Promise.all(requests);
        if (controller.signal.aborted) return;

        state.cache.loadedStartMs = fetchRange.startMs;
        state.cache.loadedEndMs = fetchRange.endMs;
        rebuildRenderCache();
        if (state.liveFollowNow) {
          alignLiveFollowViewport();
        } else {
          applyDataScrollBounds();
        }

        const { startMs, endMs } = currentRange();
        const totalGlucose = state.data.stream.length + state.data.scans.length + state.data.history.length;
        const totalAmounts = state.data.amounts.length;

        setStatus(
          `Loaded ${totalGlucose} glucose values and ${totalAmounts} amounts for ${formatDateTime(startMs)} – ${formatDateTime(endMs)}; ${cacheDescription()}.`
        );
        updateSummary();
        updateSensorLegend();
        requestDraw();
        requestFullDrawAfterLayout();
        scheduleFullDraw(60);
      } catch (err) {
        if (err.name === "AbortError") return;

        const details = err && err.message ? err.message : String(err);
        setStatus(
          "Could not load data directly from Juggluco. If this URL works when opened directly in a browser tab but fails in the viewer, the browser is probably blocking JavaScript access from this page to that address. Check Juggluco CORS/web-server settings, private-network access restrictions, HTTPS-to-HTTP mixed content, and api_secret/token. Note: 127.0.0.1 means the computer running this browser, not the computer hosting this viewer. Details: " + details,
          true
        );
        requestDraw();
      } finally {
        if (state.fetchController === controller) state.fetchController = null;
        state.loading = false;
        els.loadBtn.disabled = false;

        if (state.pendingQuietLoad) {
          state.pendingQuietLoad = false;
          scheduleLoadData(80, { cacheMargin: 1.5 });
        }
      }
    }

    function scheduleLoadData(delayMs = 400, options = {}) {
      clearTimeout(state.fetchTimer);

      const cacheMargin = Number.isFinite(options.cacheMargin) ? options.cacheMargin : 0.10;
      if (isVisibleRangeInCache(cacheMargin)) {
        return;
      }

      state.fetchTimer = setTimeout(() => {
        state.fetchTimer = null;
        loadData({ force: false, quiet: true, cacheMargin });
      }, delayMs);
    }

    function schedulePrefetchData(delayMs = 120) {
      if (!shouldPrefetchSoon()) return;
      scheduleLoadData(delayMs, { cacheMargin: 1.5 });
    }

    function updateDateInputsNow() {
      clearTimeout(state.dateInputTimer);
      state.dateInputTimer = null;
      setDateInputsFromRangeStart();
    }

    function scheduleDateInputUpdate(delayMs = 120) {
      clearTimeout(state.dateInputTimer);
      state.dateInputTimer = setTimeout(updateDateInputsNow, delayMs);
    }

    function updateViewportUiNow() {
      clearTimeout(state.viewportUiTimer);
      state.viewportUiTimer = null;
      updateDateInputsNow();
      updateSummary();
    }

    function scheduleViewportUiUpdate(delayMs = 160) {
      clearTimeout(state.viewportUiTimer);
      state.viewportUiTimer = setTimeout(updateViewportUiNow, delayMs);
    }

    function requestWheelPan() {
      if (state.wheelPanRequested) return;
      state.wheelPanRequested = true;

      requestAnimationFrame(() => {
        state.wheelPanRequested = false;
        const fraction = state.pendingWheelPan;
        state.pendingWheelPan = 0;

        if (fraction !== 0) {
          pan(fraction, { deferUi: true });
        }
      });
    }

    function requestDraw(options = {}) {
      const fast = Boolean(options.fast);

      if (state.drawRequested) {
        if (!fast) state.drawFastOnly = false;
        return;
      }

      state.drawRequested = true;
      state.drawFastOnly = fast;

      requestAnimationFrame(() => {
        const fastOnly = state.drawFastOnly;
        state.drawRequested = false;
        state.drawFastOnly = false;
        draw({ fast: fastOnly });
      });
    }

    function scheduleFullDraw(delayMs = 220) {
      clearTimeout(state.fastDrawTimer);
      state.fastDrawTimer = setTimeout(() => {
        state.fastDrawTimer = null;
        requestDraw();
      }, delayMs);
    }

    function setPlotTransform(px) {
      const value = Math.round(px * 10) / 10;
      if (Math.abs(value - state.scrollTransformPx) < 0.05) return;
      state.scrollTransformPx = value;
      if (els.glCanvas) {
        els.glCanvas.style.transform = `translate3d(${value}px, 0, 0)`;
      }
      if (els.amountCanvas) {
        els.amountCanvas.style.transform = `translate3d(${value}px, 0, 0)`;
      }
    }

    function resetPlotTransform() {
      state.scrollTransformPx = 0;
      if (els.glCanvas) {
        els.glCanvas.style.transform = "translate3d(0, 0, 0)";
      }
      if (els.amountCanvas) {
        els.amountCanvas.style.transform = "translate3d(0, 0, 0)";
      }
    }


    function drawOverlayForCurrentRange() {
      resizeCanvas();
      const area = getPlotArea();
      const yDom = state.lastYDomain || yDomainVisible();
      const scales = createScales(area, yDom);
      drawGrid(area, yDom, scales);
      drawAmountsOverlay(area, scales, yDom);
      drawCurrentGlucoseLabel(area, scales);
      drawHover(area, scales, yDom);
    }

    function updateCompositedPan() {
      if (!glRenderer) {
        requestDraw({ fast: true });
        return;
      }

      const area = getPlotArea();
      if (state.scrollRenderBaseCenterMs === null) {
        state.scrollRenderBaseCenterMs = state.centerMs;
      }

      const offsetPx = -((state.centerMs - state.scrollRenderBaseCenterMs) / state.windowMs) * area.w;
      setPlotTransform(offsetPx);
      drawOverlayForCurrentRange();

      // The WebGL canvas is rendered three windows wide. Rebase only when the
      // current composited shift approaches the overscan edge, instead of
      // redrawing on every wheel/pointer event.
      const sidePad = ((state.webglOverscanWindows || 3) - 1) / 2;
      const rebaseThreshold = area.w * Math.max(0.25, sidePad * 0.82);
      if (Math.abs(offsetPx) > rebaseThreshold) {
        schedulePrefetchData(50);

        // Only rebase/redraw if the visible range is already in the TSV cache.
        // Otherwise keep translating the last rendered plot until the quiet
        // prefetch finishes, avoiding the blank-then-fill visual gap.
        if (!isCurrentVisibleRangeLoaded(0.15)) return;

        resetPlotTransform();
        state.scrollRenderBaseCenterMs = state.centerMs;
        requestDraw({ fast: true });
      }
    }

    function updateSummary() {
      const { startMs, endMs } = currentRange();
      const sensorCount = state.cache.sensorStats.length;
      /*
      const sensors = sensorCount
        ? ` · ${sensorCount} sensor${sensorCount === 1 ? "" : "s"}`
        : "";
      els.summary.textContent = `${formatDateTime(startMs)} – ${formatDateTime(endMs)}${sensors}`;
*/
      els.summary.textContent = `${formatDateTime(startMs)} – ${formatDateTime(endMs)}`;
    }

    function plotAreaFromSize(width, height) {
      const compactWidth = width < 520;
      const compactHeight = height < 300;
      const veryNarrow = width < 380;
      const veryShort = height < 210;
      const shortLandscape = width >= 520 && height <= 360;
      const tightLandscape = width >= 620 && height <= 300;
      const unitIsMg = state.unit === "mg/dL";

      let left;
      if (veryNarrow) {
        left = unitIsMg ? 42 : 34;
      } else if (tightLandscape) {
        left = unitIsMg ? 42 : 32;
      } else if (shortLandscape) {
        left = unitIsMg ? 44 : 34;
      } else if (compactWidth) {
        // Phone portrait still needs room for the rotated label and y-axis text,
        // but not the wider gutter that slipped into the previous build.
        left = unitIsMg ? 48 : 40;
      } else {
        // Desktop and tablet layouts do not need the large original y-axis gutter.
        left = unitIsMg ? 50 : 42;
      }

      const right = shortLandscape ? 1 : (compactWidth ? 2 : 4);
      const top = veryShort ? 1 : (shortLandscape ? 2 : (compactHeight ? 4 : 6));
      const bottom = veryShort ? 11 : (shortLandscape ? 13 : (compactHeight ? 16 : 18));
      const labelX = shortLandscape ? 8 : (compactWidth ? 12 : 12);
      const yTickGap = shortLandscape ? 2 : 3;

      return {
        x: left,
        y: top,
        w: Math.max(10, width - left - right),
        h: Math.max(10, height - top - bottom),
        width,
        height,
        labelX,
        yTickGap
      };
    }

    function ensureGraphLayerStyles() {
      // Some older in-app viewer.html shells have older canvas CSS. Force the
      // graph layers to share the same CSS coordinate system before sizing and
      // hit-testing, so touch positions match the visible WebGL curve.
      if (els.chartWrap) {
        const position = window.getComputedStyle ? getComputedStyle(els.chartWrap).position : "";
        if (!position || position === "static") els.chartWrap.style.position = "relative";
        els.chartWrap.style.overflow = "hidden";
      }

      [els.canvas, els.glCanvas, els.amountCanvas].forEach(canvas => {
        if (!canvas) return;
        canvas.style.position = "absolute";
        canvas.style.display = "block";
        canvas.style.touchAction = "none";
      });

      if (els.plotClip) {
        els.plotClip.style.position = "absolute";
        els.plotClip.style.overflow = "hidden";
        els.plotClip.style.pointerEvents = "none";
      }
    }

    function resizeCanvas() {
      ensureGraphLayerStyles();
      const rect = els.chartWrap.getBoundingClientRect();
      const rawDpr = window.devicePixelRatio || 1;
      const width = Math.max(180, Math.floor(rect.width));
      const height = Math.max(80, Math.floor(rect.height));
      const overscan = state.webglOverscanWindows || 3;
      const area = plotAreaFromSize(width, height);

      // Full-screen slowness was mostly fill-rate: rendering a 3x-wide WebGL
      // canvas at full devicePixelRatio can become enormous. The earlier cap made
      // scrolling fast, but also made the curve jagged/soft at fullscreen. This
      // version uses a user-selectable curve-resolution target and a pixel budget
      // tied to that target. Scrolling itself remains cheap because panning is a
      // compositor transform; the higher-resolution redraw happens after motion settles.
      const overlayDpr = Math.min(rawDpr, 1.5);
      const targetGlDpr = curveResolutionScale();
      const maxGlPixels = 3600000 * targetGlDpr * targetGlDpr;
      const idealGlPixels = Math.max(1, area.w * overscan * area.h);
      const budgetScale = Math.sqrt(maxGlPixels / idealGlPixels);
      const glDpr = Math.max(0.5, Math.min(rawDpr, targetGlDpr, budgetScale));

      if (
        state.resize.width !== width ||
        state.resize.height !== height ||
        state.resize.dpr !== overlayDpr ||
        state.resize.glDpr !== glDpr
      ) {
        els.canvas.width = Math.floor(width * overlayDpr);
        els.canvas.height = Math.floor(height * overlayDpr);
        els.canvas.style.width = `${width}px`;
        els.canvas.style.height = `${height}px`;
        els.canvas.style.left = "0px";
        els.canvas.style.right = "auto";
        els.canvas.style.top = "0px";
        els.canvas.style.bottom = "auto";

        // Clip the GPU-rendered curve to the actual plot rectangle. This prevents
        // the curve from sliding under the y-axis numbers and the "Glucose" label
        // while composited panning is active.
        els.plotClip.style.left = `${area.x}px`;
        els.plotClip.style.top = `${area.y}px`;
        els.plotClip.style.width = `${area.w}px`;
        els.plotClip.style.height = `${area.h}px`;

        const sidePad = (overscan - 1) / 2;
        els.glCanvas.width = Math.max(1, Math.floor(area.w * overscan * glDpr));
        els.glCanvas.height = Math.max(1, Math.floor(area.h * glDpr));
        els.glCanvas.style.width = `${area.w * overscan}px`;
        els.glCanvas.style.height = `${area.h}px`;
        els.glCanvas.style.left = `${-area.w * sidePad}px`;
        els.glCanvas.style.right = "auto";
        els.glCanvas.style.top = "0px";
        els.glCanvas.style.bottom = "auto";

        els.amountCanvas.width = Math.max(1, Math.floor(area.w * overscan * overlayDpr));
        els.amountCanvas.height = Math.max(1, Math.floor(area.h * overlayDpr));
        els.amountCanvas.style.width = `${area.w * overscan}px`;
        els.amountCanvas.style.height = `${area.h}px`;
        els.amountCanvas.style.left = `${-area.w * sidePad}px`;
        els.amountCanvas.style.right = "auto";
        els.amountCanvas.style.top = "0px";
        els.amountCanvas.style.bottom = "auto";

        state.resize = { width, height, dpr: overlayDpr, glDpr };
        state.lastYDomain = null;
        state.scrollRenderBaseCenterMs = null;
        resetPlotTransform();
      }

      ctx.setTransform(overlayDpr, 0, 0, overlayDpr, 0, 0);
      amountCtx.setTransform(overlayDpr, 0, 0, overlayDpr, 0, 0);
    }

    function getPlotArea() {
      const width = state.resize.width || els.canvas.clientWidth || 180;
      const height = state.resize.height || els.canvas.clientHeight || 80;
      return plotAreaFromSize(width, height);
    }

    function allVisibleGlucose() {
      return [
        ...(els.showStream.checked ? state.data.stream : []),
        ...(els.showScans.checked ? state.data.scans : []),
        ...(els.showHistory.checked ? state.data.history : [])
      ];
    }

    function allLoadedGlucose() {
      return [
        ...state.data.stream,
        ...state.data.scans,
        ...state.data.history
      ];
    }

    function sensorKey(sensor) {
      const value = String(sensor || "").trim();
      return value || "Unknown sensor";
    }

    function hashString(value) {
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
      }
      return Math.abs(hash);
    }

    function colorForSensor(sensor) {
      const key = sensorKey(sensor);
      return SENSOR_PALETTE[hashString(key) % SENSOR_PALETTE.length];
    }

    function groupPointsBySensor(points) {
      const groups = new Map();

      for (const p of points) {
        const key = sensorKey(p.sensor);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(p);
      }

      return Array.from(groups.entries())
        .map(([sensor, group]) => [
          sensor,
          group.sort((a, b) => a.t - b.t)
        ])
        .sort((a, b) => {
          const firstA = a[1][0]?.t ?? 0;
          const firstB = b[1][0]?.t ?? 0;
          return firstA - firstB || a[0].localeCompare(b[0]);
        });
    }

    function lowerBoundByTime(points, targetMs) {
      let lo = 0;
      let hi = points.length;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (points[mid].t < targetMs) lo = mid + 1;
        else hi = mid;
      }

      return lo;
    }

    function getSensorStats() {
      const stats = new Map();

      for (const p of allLoadedGlucose()) {
        const key = sensorKey(p.sensor);
        if (!stats.has(key)) {
          stats.set(key, { sensor: key, count: 0, first: p.t, last: p.t });
        }

        const item = stats.get(key);
        item.count++;
        item.first = Math.min(item.first, p.t);
        item.last = Math.max(item.last, p.t);
      }

      return Array.from(stats.values())
        .sort((a, b) => a.first - b.first || a.sensor.localeCompare(b.sensor));
    }

    function rebuildRenderCache() {
      state.cache.streamGroups = groupPointsBySensor(state.data.stream);
      state.cache.historyGroups = groupPointsBySensor(state.data.history);
      state.cache.allGlucoseSorted = allLoadedGlucose().sort((a, b) => a.t - b.t);
      state.cache.sensorStats = getSensorStats();
      state.lastYDomain = null;
      state.scrollRenderBaseCenterMs = null;
      resetPlotTransform();
      if (glRenderer) glRenderer.rebuild();
    }

    function updateSensorLegend() {
      const stats = state.cache.sensorStats;

      if (!stats.length) {
        els.sensorLegend.innerHTML = '<span class="legend-item">No sensors loaded yet.</span>';
        return;
      }

      els.sensorLegend.innerHTML = stats.map(item => {
        const color = colorForSensor(item.sensor);
        const label = escapeHtml(item.sensor);
        const count = item.count === 1 ? "1 value" : `${item.count} values`;
        const range = `${escapeHtml(formatTime(item.first))}–${escapeHtml(formatTime(item.last))}`;

        return `<span class="legend-item" title="${label}: ${count}, ${range}">
          <span class="swatch" style="background:${color}"></span>${label}
        </span>`;
      }).join("");
    }

    function includeY(value, acc) {
      if (!Number.isFinite(value)) return;
      acc.min = Math.min(acc.min, value);
      acc.max = Math.max(acc.max, value);
      acc.count++;
    }

    function includeVisibleSortedPoints(points, startMs, endMs, acc) {
      let i = lowerBoundByTime(points, startMs);

      for (; i < points.length; i++) {
        const p = points[i];
        if (p.t > endMs) break;
        includeY(p.y, acc);
      }
    }

    function includeVisibleGroupedPoints(groups, startMs, endMs, acc) {
      for (const [, group] of groups) {
        includeVisibleSortedPoints(group, startMs, endMs, acc);
      }
    }

    function yTickStepForDomain(min, max) {
      const span = Math.max(0.0001, max - min);

      if (state.unit === "mg/dL") {
        if (span <= 90) return 10;
        if (span <= 180) return 20;
        return 50;
      }

      if (span <= 7) return 0.5;
      if (span <= 14) return 1;
      return 2;
    }

    function roundOutward(value, step, direction) {
      if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
      const scaled = value / step;
      const rounded = direction < 0 ? Math.floor(scaled + 1e-9) : Math.ceil(scaled - 1e-9);
      return rounded * step;
    }

    function configuredGraphRange() {
      const unitIsMg = state.unit === "mg/dL";
      const fallback = unitIsMg ? { min: 40, max: 200 } : { min: 2, max: 11 };
      let min = parseNumber(els.graphMin?.value);
      let max = parseNumber(els.graphMax?.value);

      if (!Number.isFinite(min)) min = fallback.min;
      if (!Number.isFinite(max)) max = fallback.max;
      if (max <= min) max = min + (unitIsMg ? 40 : 3);

      return { min, max };
    }

    function yDomainVisible() {
      const base = configuredGraphRange();
      const { startMs, endMs } = currentRange();

      const acc = {
        min: base.min,
        max: base.max,
        count: 0
      };

      if (els.showStream.checked) {
        includeVisibleGroupedPoints(state.cache.streamGroups, startMs, endMs, acc);
      }

      if (els.showHistory.checked) {
        includeVisibleGroupedPoints(state.cache.historyGroups, startMs, endMs, acc);
      }

      if (els.showScans.checked) {
        includeVisibleSortedPoints(state.data.scans, startMs, endMs, acc);
      }

      includeY(parseNumber(els.lowLimit.value), acc);
      includeY(parseNumber(els.highLimit.value), acc);

      let min = Math.min(base.min, acc.min);
      let max = Math.max(base.max, acc.max);
      let step = yTickStepForDomain(min, max);

      min = roundOutward(min, step, -1);
      max = roundOutward(max, step, 1);

      // Re-check the step after rounding; a larger expanded range may need whole
      // mmol/L grid lines instead of half-step grid lines.
      const adjustedStep = yTickStepForDomain(min, max);
      if (adjustedStep !== step) {
        step = adjustedStep;
        min = roundOutward(min, step, -1);
        max = roundOutward(max, step, 1);
      }

      if (max <= min) max = min + step * 4;
      return { min, max, step };
    }

    function createScales(area, yDom) {
      const { startMs, endMs } = currentRange();

      const xScale = t => area.x + ((t - startMs) / (endMs - startMs)) * area.w;
      const yScale = y => area.y + area.h - ((y - yDom.min) / (yDom.max - yDom.min)) * area.h;
      const xInv = x => startMs + ((x - area.x) / area.w) * (endMs - startMs);

      return { xScale, yScale, xInv };
    }

    function drawGrid(area, yDom, scales) {
      ctx.clearRect(0, 0, area.width, area.height);

      const low = parseNumber(els.lowLimit.value);
      const high = parseNumber(els.highLimit.value);

      if (Number.isFinite(low) && Number.isFinite(high)) {
        const yHigh = scales.yScale(high);
        const yLow = scales.yScale(low);
        ctx.fillStyle = COLORS.targetFill;
        ctx.fillRect(area.x, Math.min(yLow, yHigh), area.w, Math.abs(yLow - yHigh));
      }

      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      ctx.fillStyle = COLORS.text;
      ctx.font = "12px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      const yStep = yDom.step || yTickStepForDomain(yDom.min, yDom.max);
      const yDigits = state.unit === "mg/dL" ? 0 : (yStep < 1 ? 1 : 0);
      const firstYTick = roundOutward(yDom.min, yStep, 1);

      for (let yValue = firstYTick; yValue <= yDom.max + yStep * 0.001; yValue += yStep) {
        const y = scales.yScale(yValue);
        if (y < area.y - 0.5 || y > area.y + area.h + 0.5) continue;

        ctx.beginPath();
        ctx.moveTo(area.x, y);
        ctx.lineTo(area.x + area.w, y);
        ctx.stroke();

        ctx.fillText(
          niceNumber(yValue, yDigits),
          area.x - (area.yTickGap || 7),
          y
        );
      }

      if (Number.isFinite(low)) drawLimitLine(area, scales.yScale(low), `${niceNumber(low)} ${state.unit}`);
      if (Number.isFinite(high)) drawLimitLine(area, scales.yScale(high), `${niceNumber(high)} ${state.unit}`);

      const { startMs, endMs } = currentRange();
      const durationHours = (endMs - startMs) / 3600000;
      let stepMs;

      if (durationHours <= 3) stepMs = 30 * 60 * 1000;
      else if (durationHours <= 6) stepMs = 60 * 60 * 1000;
      else if (durationHours <= 12) stepMs = 2 * 60 * 60 * 1000;
      else if (durationHours <= 24) stepMs = 4 * 60 * 60 * 1000;
      else if (durationHours <= 48) stepMs = 8 * 60 * 60 * 1000;
      else stepMs = 24 * 60 * 60 * 1000;

      const firstTick = Math.ceil(startMs / stepMs) * stepMs;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      for (let t = firstTick; t <= endMs; t += stepMs) {
        const x = scales.xScale(t);

        ctx.beginPath();
        ctx.moveTo(x, area.y);
        ctx.lineTo(x, area.y + area.h);
        ctx.stroke();

        const d = new Date(t);
        const label = durationHours > 36
          ? formatDate(t, { year: "numeric", month: "short", day: "numeric" })
          : formatTime(t);

        ctx.fillText(label, x, area.y + area.h + 3);
      }

      ctx.strokeStyle = COLORS.textStrong;
      ctx.beginPath();
      ctx.moveTo(area.x, area.y);
      ctx.lineTo(area.x, area.y + area.h);
      ctx.lineTo(area.x + area.w, area.y + area.h);
      ctx.stroke();

      if (area.width >= 360 && area.h >= 120) {
        ctx.save();
        ctx.translate(14, area.y + area.h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = COLORS.text;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Glucose (${state.unit})`, 0, 0);
        ctx.restore();
      }
    }

    function drawLimitLine(area, y, label) {
      if (y < area.y || y > area.y + area.h) return;

      ctx.save();
      ctx.strokeStyle = COLORS.lowHigh;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(area.x, y);
      ctx.lineTo(area.x + area.w, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = COLORS.lowHigh;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(label, area.x + 6, y - 3);
      ctx.restore();
    }

    function latestVisibleStreamStatus() {
      if (!els.showStream.checked || !state.data.stream.length) return null;

      const now = Date.now();
      const maxAgeMs = 5.5 * 60 * 1000;
      const futureToleranceMs = 60 * 1000;
      const { startMs, endMs } = currentRange();

      for (let i = state.data.stream.length - 1; i >= 0; i--) {
        const p = state.data.stream[i];
        if (!p || !Number.isFinite(p.t) || !Number.isFinite(p.y)) continue;

        // Ignore obviously future-dated rows, but allow small clock skew between
        // the browser and the Juggluco device/server.
        if (p.t > now + futureToleranceMs) continue;

        // The annotation belongs to the latest visible part of the curve. If the
        // latest point is not visible, historical scrolling should not show a
        // current-value label or stale-current-value message.
        if (p.t < startMs || p.t > endMs + futureToleranceMs) return null;

        const isFresh = (now - p.t) <= maxAgeMs;

        // The stale-current-value message is only meaningful in the current
        // viewport. Old historical ranges should stay silent.
        if (!isFresh && !isCurrentTimeInOrNearView()) return null;

        return { point: p, isFresh };
      }

      return null;
    }

    function drawRateArrow(context, rate, getx, gety, scale = 1) {
      if (!Number.isFinite(rate)) return;

      const density = Math.max(0.35, Math.min(1.2, scale));
      const headHeight = 24 * density;
      const strokeWidth = Math.max(2.7, curveThicknessPx() * 0.85 * density * 2.85);
      let tipY = gety;

      if (rate <= 0.0) tipY -= headHeight / 12.5;

      const x1 = getx - density * 40;
      const y1 = tipY + rate * density * 30;
      let rx = getx - x1;
      let ry = tipY - y1;
      const rlen = Math.hypot(rx, ry);
      if (!Number.isFinite(rlen) || rlen <= 0.0001) return;

      rx /= rlen;
      ry /= rlen;

      const l = density * 12;
      const addx = l * rx;
      const addy = l * ry;
      const tx1 = getx - 2 * addx;
      const ty1 = tipY - 2 * addy;
      const xtus = getx - 1.5 * addx;
      const ytus = tipY - 1.5 * addy;
      const hx = ry;
      const hy = -rx;
      const sx1 = tx1 + l * hx;
      const sy1 = ty1 + l * hy;
      const sx2 = tx1 - l * hx;
      const sy2 = ty1 - l * hy;

      context.save();
      context.strokeStyle = COLORS.textStrong;
      context.fillStyle = COLORS.textStrong;
      context.lineWidth = strokeWidth;
      context.lineCap = "round";
      context.lineJoin = "round";

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(xtus, ytus);
      context.stroke();

      context.beginPath();
      context.moveTo(sx1, sy1);
      context.lineTo(getx, tipY);
      context.lineTo(sx2, sy2);
      context.lineTo(xtus, ytus);
      context.closePath();
      context.fill();
      context.restore();
    }

    function drawCurrentGlucoseLabel(area, scales) {
      const status = latestVisibleStreamStatus();
      if (!status || !status.point) return;

      const point = status.point;
      const pointX = scales.xScale(point.t);
      const plotRight = area.x + area.w;
      const y = area.y + area.h / 2;
      const compact = area.width < 520 || area.height < 300;
      const rightPad = compact ? 4 : 8;
      const rightX = plotRight - rightPad;

      if (pointX < area.x || pointX > plotRight) return;

      ctx.save();

      if (!status.isFresh) {
        const message = `No new value since ${formatMeasurementTimestamp(point.t)}`;
        const fontSize = compact ? 14 : (area.width < 700 ? 20 : 24);

        ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        const messageWidth = ctx.measureText(message).width;
        const requiredSpace = messageWidth + 14;

        // Show the stale message only where the current-value annotation would
        // normally fit: in the empty space to the right of the latest curve point.
        if (plotRight - pointX < requiredSpace) {
          ctx.restore();
          return;
        }

        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeText(message, rightX, y);
        ctx.fillStyle = COLORS.textStrong;
        ctx.fillText(message, rightX, y);
        ctx.restore();
        return;
      }

      const valueText = formatGlucoseValue(point.y);
      if (!valueText) {
        ctx.restore();
        return;
      }

      const fontSize = currentLabelFontSize(area);
      const timeFontSize = compact ? 10 : 12;
      const timeText = formatMeasurementTimestamp(point.t);

      ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const textWidth = ctx.measureText(valueText).width;
      const arrowScale = compact ? 0.74 : 1.03;
      const arrowSpace = compact ? 29 : 58;
      const requiredSpace = textWidth + arrowSpace + rightPad;

      // The current label is only drawn when there is enough empty room at the
      // right of the latest curve point, matching the native Juggluco placement.
      if (plotRight - pointX < requiredSpace) {
        ctx.restore();
        return;
      }

      const textX = plotRight - rightPad - textWidth;
      const arrowTipX = textX - 8;

      // White halo keeps the native-style black label readable on top of the
      // target-range fill, grid lines, and colored sensor curves.
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.strokeText(valueText, textX, y);
      drawRateArrow(ctx, point.rate, arrowTipX, y, arrowScale);
      ctx.fillStyle = COLORS.textStrong;
      ctx.fillText(valueText, textX, y);

      ctx.font = `${timeFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const timeX = Math.max(
        area.x + 22,
        Math.min(plotRight - 22, textX + textWidth / 2)
      );
      const timeY = Math.min(
        area.y + area.h - timeFontSize - 2,
        y + fontSize * 0.50 + 2
      );

      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.strokeText(timeText, timeX, timeY);
      ctx.fillStyle = COLORS.text;
      ctx.fillText(timeText, timeX, timeY);
      ctx.restore();
    }

    const AMOUNT_PALETTE = [
      "#047857", "#2563eb", "#9333ea", "#dc2626",
      "#ea580c", "#0891b2", "#7c3aed", "#be123c",
      "#0f766e", "#4f46e5", "#a16207", "#c026d3"
    ];

    function normalizedAmountLabel(label) {
      return String(label || "Amount").trim() || "Amount";
    }

    function amountLabelColorMap() {
      const firstSeen = new Map();

      for (const amount of state.data.amounts) {
        if (!amount || !Number.isFinite(amount.t)) continue;
        const label = normalizedAmountLabel(amount.label);
        if (!firstSeen.has(label)) firstSeen.set(label, amount.t);
      }

      return new Map(
        Array.from(firstSeen.entries())
          .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
          .map(([label], idx) => [label, AMOUNT_PALETTE[idx % AMOUNT_PALETTE.length]])
      );
    }

    function amountColorForLabel(label, colorMap = null) {
      const key = normalizedAmountLabel(label);
      if (colorMap && colorMap.has(key)) return colorMap.get(key);
      return AMOUNT_PALETTE[hashString(key) % AMOUNT_PALETTE.length];
    }

    function formatAmountNumber(value) {
      if (!Number.isFinite(value)) return "";
      return niceNumber(value, 1);
    }

    function drawTextChip(context, text, x, y, options = {}) {
      if (!text) return;
      const padX = options.padX ?? 4;
      const padY = options.padY ?? 1;
      const radius = options.radius ?? 3;
      const color = options.color ?? COLORS.textStrong;
      const background = options.background ?? null;
      const font = options.font ?? "12px system-ui, sans-serif";
      const minX = options.minX ?? -Infinity;
      const maxX = options.maxX ?? Infinity;

      context.save();
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const width = context.measureText(text).width;
      const rectW = width + padX * 2;
      const rectH = (options.fontSize ?? 12) + padY * 2;
      const clampedX = Math.max(minX + rectW / 2, Math.min(maxX - rectW / 2, x));

      if (background && background !== "transparent") {
        roundRect(context, clampedX - rectW / 2, y - rectH / 2, rectW, rectH, radius);
        context.fillStyle = background;
        context.fill();
      }

      if (options.halo !== false) {
        context.lineWidth = options.haloWidth ?? 2.5;
        context.strokeStyle = options.haloColor ?? "rgba(255, 255, 255, 0.72)";
        context.strokeText(text, clampedX, y + (options.textYOffset ?? 0));
      }

      context.fillStyle = color;
      context.fillText(text, clampedX, y + (options.textYOffset ?? 0));
      context.restore();
    }

    function amountTextWidth(text, font) {
      ctx.save();
      ctx.font = font;
      const width = ctx.measureText(text).width;
      ctx.restore();
      return width;
    }

    function buildAmountLayout(area, scales, yDom) {
      if (!els.showAmounts.checked || !state.data.amounts.length) return [];

      const { startMs, endMs } = currentRange();
      const groups = new Map();
      const labelFirstSeen = new Map();

      for (const amount of state.data.amounts) {
        if (!amount || !Number.isFinite(amount.t) || !Number.isFinite(amount.value)) continue;

        const label = normalizedAmountLabel(amount.label);
        if (!labelFirstSeen.has(label)) labelFirstSeen.set(label, amount.t);

        if (amount.t < startMs || amount.t > endMs) continue;
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label).push(amount);
      }

      const ordered = Array.from(groups.entries())
        .map(([label, items]) => ({
          label,
          items: items.sort((a, b) => a.t - b.t),
          firstT: labelFirstSeen.get(label) ?? items[0]?.t ?? 0
        }))
        .sort((a, b) => a.firstT - b.firstT || a.label.localeCompare(b.label));

      if (!ordered.length) return [];

      const labelFontSize = 12;
      const valueFontSize = 12;
      const labelFont = `700 ${labelFontSize}px system-ui, sans-serif`;
      const valueFont = `${valueFontSize}px system-ui, sans-serif`;
      const rowGap = 3;
      const pairHeight = labelFontSize + valueFontSize + rowGap;
      const maxRows = Math.max(1, Math.floor(area.h / Math.max(18, pairHeight)));
      const labelRowCount = Math.min(ordered.length, maxRows);
      const colorMap = amountLabelColorMap();
      const domainMin = Number.isFinite(yDom?.min) ? yDom.min : configuredGraphRange().min;
      const domainMax = Number.isFinite(yDom?.max) ? yDom.max : configuredGraphRange().max;
      const span = Math.max(0.0001, domainMax - domainMin);
      const topPadding = pairHeight / 2 + 2;
      const bottomPadding = pairHeight / 2 + 2;
      const items = [];

      for (let idx = 0; idx < labelRowCount; idx++) {
        const group = ordered[idx];
        const color = amountColorForLabel(group.label, colorMap);
        const fraction = (idx + 0.5) / labelRowCount;
        const yValue = domainMax - fraction * span;
        let midY = scales.yScale(yValue);

        midY = Math.max(
          area.y + topPadding,
          Math.min(area.y + area.h - bottomPadding, midY)
        );

        const labelY = midY - (valueFontSize / 2 + rowGap / 2);
        const valueY = midY + (labelFontSize / 2 + rowGap / 2);
        const first = group.items[0];
        const labelText = group.label;
        const labelW = amountTextWidth(labelText, labelFont) + 8;
        const labelH = labelFontSize + 4;
        const labelX = Math.max(
          area.x + labelW / 2,
          Math.min(area.x + area.w - labelW / 2, scales.xScale(first.t))
        );

        items.push({
          kind: "label",
          type: "amount-label",
          label: group.label,
          text: labelText,
          t: first.t,
          x: labelX,
          y: labelY,
          w: labelW,
          h: labelH,
          color,
          font: labelFont,
          fontSize: labelFontSize
        });

        for (const amount of group.items) {
          const text = formatAmountNumber(amount.value);
          const w = amountTextWidth(text, valueFont) + 6;
          const h = valueFontSize + 4;
          const x = Math.max(
            area.x + w / 2,
            Math.min(area.x + area.w - w / 2, scales.xScale(amount.t))
          );

          items.push({
            kind: "value",
            type: "amount",
            label: group.label,
            text,
            source: amount,
            t: amount.t,
            x,
            y: valueY,
            w,
            h,
            color,
            font: valueFont,
            fontSize: valueFontSize
          });
        }
      }

      return items;
    }

    function drawAmountsOverlay(area, scales, yDom) {
      const items = buildAmountLayout(area, scales, yDom);

      for (const item of items) {
        drawTextChip(ctx, item.text, item.x, item.y, {
          color: item.color,
          background: null,
          font: item.font,
          fontSize: item.fontSize,
          minX: area.x,
          maxX: area.x + area.w,
          padX: item.kind === "label" ? 4 : 3,
          padY: 1,
          radius: 3,
          halo: true
        });
      }
    }

    function drawAmounts(amounts, area, scales) {
      // Amounts are drawn on the overlay canvas after the grid/curve so they sit
      // above the timelines, glucose lines, and sensor curves.
      drawAmountsOverlay(area, scales, state.lastYDomain || yDomainVisible());
    }

    function roundRect(context, x, y, w, h, r) {
      const radius = Math.min(r, w / 2, h / 2);
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + w, y, x + w, y + h, radius);
      context.arcTo(x + w, y + h, x, y + h, radius);
      context.arcTo(x, y + h, x, y, radius);
      context.arcTo(x, y, x + w, y, radius);
      context.closePath();
    }

    function drawNoData(area) {
      const total = state.data.stream.length + state.data.scans.length + state.data.history.length + state.data.amounts.length;
      if (total > 0) return;

      ctx.fillStyle = COLORS.text;
      ctx.font = "15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No data in this time window", area.x + area.w / 2, area.y + area.h / 2);
    }

    function tooltipHtmlForNearest(nearest) {
      return nearest.map(item => {
        if (item.type === "amount") {
          return `${escapeHtml(formatDateTime(item.t))}<br><strong><div style="display: flex; justify-content: space-between;"><span>${escapeHtml(item.label || "Amount")}</span><span>${escapeHtml(item.hitText || niceNumber(item.value, 1))}</span></div></strong>`;
        }

        const rate = Number.isFinite(item.rate) ? `<div style="display: flex; justify-content: space-between;"><span>${escapeHtml(item.label || "")}</span><span>${niceNumber(item.rate, 2)}</span></div>` : "";
        return `<span style="display: block; text-align: center;">${item.sensor}</span>${escapeHtml(formatDateTime(item.t))}<span style="display: block; text-align: right;"><strong>${escapeHtml(item.display)}</strong></span>${rate}`;
      }).join("<hr style='border:0;border-top:1px solid rgba(255,255,255,.2);margin:6px 0'>");
    }

    function positionTooltip(x, y) {
      const wrapRect = els.chartWrap.getBoundingClientRect();
      const tipRect = els.tooltip.getBoundingClientRect();

      let left = x + 14;
      let top = y + 14;

      if (left + tipRect.width > wrapRect.width) left = x - tipRect.width - 14;
      if (top + tipRect.height > wrapRect.height) top = y - tipRect.height - 14;

      els.tooltip.style.left = `${Math.max(4, left)}px`;
      els.tooltip.style.top = `${Math.max(4, top)}px`;
    }

    function showTooltipAtPoint(x, y, options = {}) {
      const area = getPlotArea();
      if (x < area.x || x > area.x + area.w || y < area.y || y > area.y + area.h) {
        if (!options.keepExisting) els.tooltip.style.display = "none";
        return false;
      }

      const yDom = state.lastYDomain || yDomainVisible();
      const scales = createScales(area, yDom);
      const nearest = findNearest(x, y, area, scales);

      if (!nearest.length) {
        if (!options.keepExisting) els.tooltip.style.display = "none";
        return false;
      }

      els.tooltip.innerHTML = tooltipHtmlForNearest(nearest);
      els.tooltip.style.display = "block";
      positionTooltip(x, y);
      return true;
    }

    function clientPointFromPointerEvent(event) {
      if (!event) return null;

      if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        return { clientX: event.clientX, clientY: event.clientY };
      }

      const touch = event.changedTouches?.[0] || event.touches?.[0];
      if (touch && Number.isFinite(touch.clientX) && Number.isFinite(touch.clientY)) {
        return { clientX: touch.clientX, clientY: touch.clientY };
      }

      return null;
    }

    function chartCoordsFromClientPoint(point) {
      if (!point) return null;

      // Drawing, tooltip placement and plot area sizing all use chartWrap CSS
      // pixels. Use the same rectangle for pointer conversion. Using the canvas
      // rectangle can be wrong with older viewer.html shells where the canvas has
      // stale CSS, browser zoom, or a delayed layout update.
      const rect = (els.chartWrap || els.canvas).getBoundingClientRect();
      return {
        x: point.clientX - rect.left,
        y: point.clientY - rect.top
      };
    }

    function currentHoverChartCoords() {
      if (!state.hover) return null;
      if (Number.isFinite(state.hover.clientX) && Number.isFinite(state.hover.clientY)) {
        return chartCoordsFromClientPoint(state.hover);
      }
      if (Number.isFinite(state.hover.x) && Number.isFinite(state.hover.y)) {
        return { x: state.hover.x, y: state.hover.y };
      }
      return null;
    }

    function showTooltipFromEvent(event, options = {}) {
      const clientPoint = clientPointFromPointerEvent(event);
      const chartPoint = chartCoordsFromClientPoint(clientPoint);
      if (!chartPoint) {
        if (!options.keepExisting) els.tooltip.style.display = "none";
        return false;
      }

      state.hover = clientPoint;
      const shown = showTooltipAtPoint(chartPoint.x, chartPoint.y, options);
      if (shown || options.redraw !== false) requestDraw();
      return shown;
    }

    function drawHoverMarker(hit, area) {
      if (!hit) return;

      const x = hit.hitX;
      const y = hit.hitY;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(area.x, area.y, area.w, area.h);
      ctx.clip();

      if (hit.type === "amount" && Number.isFinite(hit.hitW) && Number.isFinite(hit.hitH)) {
        const padX = 7;
        const padY = 5;
        const w = hit.hitW + 2 * padX;
        const h = hit.hitH + 2 * padY;
        const left = x - w / 2;
        const top = y - h / 2;

        ctx.lineJoin = "round";
        roundRect(ctx, left, top, w, h, 6);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 5;
        ctx.stroke();
        roundRect(ctx, left, top, w, h, 6);
        ctx.strokeStyle = COLORS.amounts;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        return;
      }

      const color = hit.markerColor || colorForSensor(hit.sensor);
      const radius = Math.max(3, curveThicknessPx() * 1.5);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Smaller filled point marker. The white halo keeps it visible on dark or
      // overlapping curves, while the colored core marks the touched value.
      ctx.beginPath();
      ctx.arc(x, y, radius + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function drawHover(area, scales, yDom) {
      if (!state.hover) return;

      const hoverPoint = currentHoverChartCoords();
      if (!hoverPoint) {
        els.tooltip.style.display = "none";
        return;
      }

      const { x, y } = hoverPoint;
      if (x < area.x || x > area.x + area.w || y < area.y || y > area.y + area.h) {
        els.tooltip.style.display = "none";
        return;
      }

      const nearest = findNearest(x, y, area, scales);
      if (!nearest.length) {
        els.tooltip.style.display = "none";
        return;
      }

      for (const hit of nearest) {
        drawHoverMarker(hit, area);
      }

      els.tooltip.innerHTML = tooltipHtmlForNearest(nearest);
      els.tooltip.style.display = "block";
      positionTooltip(x, y);
    }

    function findNearest(mouseX, mouseY, area, scales) {
      const results = [];
      const targetMs = scales.xInv(mouseX);
      const glucoseToleranceMs = Math.max(60 * 1000, (18 / area.w) * state.windowMs);
      const pointTolerancePx = 18;
      const lineTolerancePx = 14;

      let best = null;
      let bestDistance = Infinity;

      function scanSorted(points, toleranceMs, callback) {
        let i = lowerBoundByTime(points, targetMs - toleranceMs);
        for (; i < points.length; i++) {
          const p = points[i];
          if (p.t > targetMs + toleranceMs) break;
          callback(p);
        }
      }

      function considerPoint(p) {
        const x = scales.xScale(p.t);
        const y = scales.yScale(p.y);
        const d = Math.hypot(x - mouseX, y - mouseY);
        if (d < bestDistance) {
          bestDistance = d;
          best = {
            ...p,
            hitX: x,
            hitY: y,
            markerColor: colorForSensor(p.sensor)
          };
        }
      }

      function considerSegment(p1, p2, maxGapMs) {
        if (!p1 || !p2) return;
        if (!Number.isFinite(p1.t) || !Number.isFinite(p1.y) || !Number.isFinite(p2.t) || !Number.isFinite(p2.y)) return;
        if (p2.t <= p1.t || p2.t - p1.t > maxGapMs) return;

        const x1 = scales.xScale(p1.t);
        const y1 = scales.yScale(p1.y);
        const x2 = scales.xScale(p2.t);
        const y2 = scales.yScale(p2.y);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        if (len2 <= 0.0001) return;

        const u = Math.max(0, Math.min(1, ((mouseX - x1) * dx + (mouseY - y1) * dy) / len2));
        const x = x1 + u * dx;
        const y = y1 + u * dy;
        const d = Math.hypot(x - mouseX, y - mouseY);

        if (d < bestDistance) {
          const t = p1.t + (p2.t - p1.t) * u;
          const glucose = p1.y + (p2.y - p1.y) * u;
          bestDistance = d;
          best = {
            ...p2,
            t,
            y: glucose,
            display: `${formatGlucoseValue(glucose)} ${state.unit}`,
            interpolated: true,
            hitX: x,
            hitY: y,
            markerColor: colorForSensor(p2.sensor)
          };
        }
      }

      function scanLineGroup(group, maxGapMs) {
        const startT = targetMs - glucoseToleranceMs;
        const endT = targetMs + glucoseToleranceMs;
        let i = Math.max(0, lowerBoundByTime(group, startT) - 1);

        for (; i < group.length; i++) {
          const p = group[i];
          if (p.t > endT) break;
          considerPoint(p);
          if (i + 1 < group.length) considerSegment(p, group[i + 1], maxGapMs);
        }
      }

      if (els.showStream.checked) {
        for (const [, group] of state.cache.streamGroups) {
          scanLineGroup(group, 12 * 60 * 1000);
        }
      }

      if (els.showHistory.checked) {
        for (const [, group] of state.cache.historyGroups) {
          scanLineGroup(group, 45 * 60 * 1000);
        }
      }

      if (els.showScans.checked) {
        scanSorted(state.data.scans, glucoseToleranceMs, considerPoint);
      }

      if (best && bestDistance <= (best.interpolated ? lineTolerancePx : pointTolerancePx)) {
        results.push(best);
      }

      if (els.showAmounts.checked) {
        const layout = buildAmountLayout(area, scales, state.lastYDomain || yDomainVisible());
        const hits = [];

        for (const item of layout) {
          if (item.kind !== "value") continue;
          const dx = Math.abs(mouseX - item.x);
          const dy = Math.abs(mouseY - item.y);
          if (dx <= item.w / 2 + 5 && dy <= item.h / 2 + 5) {
            hits.push({
              item,
              distance: Math.hypot(
                dx / Math.max(1, item.w),
                dy / Math.max(1, item.h)
              )
            });
          }
        }

        hits
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3)
          .forEach(hit => {
            if (hit.item.kind === "value") {
              results.push({
                ...hit.item.source,
                type: "amount",
                label: hit.item.label,
                display: `${hit.item.text} ${hit.item.label}`,
                hitText: hit.item.text,
                hitX: hit.item.x,
                hitY: hit.item.y,
                hitW: hit.item.w,
                hitH: hit.item.h,
                markerColor: COLORS.amounts
              });
            }
          });
      }

      return results;
    }

    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }



    function hexToRgba(hex, alpha = 1) {
      const value = String(hex || "#000000").replace("#", "");
      const n = Number.parseInt(value.length === 3
        ? value.split("").map(ch => ch + ch).join("")
        : value, 16);

      return [
        ((n >> 16) & 255) / 255,
        ((n >> 8) & 255) / 255,
        (n & 255) / 255,
        alpha
      ];
    }

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || "Unknown shader error";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    function createProgram(gl, vertexSource, fragmentSource) {
      const program = gl.createProgram();
      gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) || "Unknown program link error";
        gl.deleteProgram(program);
        throw new Error(message);
      }
      return program;
    }

    function createWebGlPlotRenderer(canvas) {
      const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });

      if (!gl) return null;

      const lineVertexSource = `
        precision highp float;

        attribute vec2 a_start;
        attribute vec2 a_end;
        attribute vec4 a_color;
        attribute float a_side;
        attribute float a_endpoint;

        uniform vec2 u_time;
        uniform vec2 u_y;
        uniform vec4 u_area;
        uniform vec2 u_resolution;
        uniform float u_lineWidth;

        varying vec4 v_color;

        vec2 dataToPixel(vec2 p) {
          float xNorm = (p.x - u_time.x) / max(u_time.y - u_time.x, 0.000001);
          float yNorm = (p.y - u_y.x) / max(u_y.y - u_y.x, 0.000001);
          return vec2(
            u_area.x + xNorm * u_area.z,
            u_area.y + (1.0 - yNorm) * u_area.w
          );
        }

        void main() {
          vec2 startPx = dataToPixel(a_start);
          vec2 endPx = dataToPixel(a_end);
          vec2 dir = endPx - startPx;
          float len = length(dir);
          vec2 normal = len > 0.0001 ? vec2(-dir.y, dir.x) / len : vec2(0.0, 1.0);
          vec2 posPx = mix(startPx, endPx, a_endpoint) + normal * a_side * u_lineWidth * 0.5;

          vec2 clip = vec2(
            (posPx.x / u_resolution.x) * 2.0 - 1.0,
            1.0 - (posPx.y / u_resolution.y) * 2.0
          );

          gl_Position = vec4(clip, 0.0, 1.0);
          v_color = a_color;
        }`;

      const pointVertexSource = `
        precision highp float;

        attribute vec2 a_pos;
        attribute vec4 a_color;

        uniform vec2 u_time;
        uniform vec2 u_y;
        uniform vec4 u_area;
        uniform vec2 u_resolution;
        uniform float u_pointSize;

        varying vec4 v_color;

        void main() {
          float xNorm = (a_pos.x - u_time.x) / max(u_time.y - u_time.x, 0.000001);
          float yNorm = (a_pos.y - u_y.x) / max(u_y.y - u_y.x, 0.000001);

          float xPx = u_area.x + xNorm * u_area.z;
          float yPx = u_area.y + (1.0 - yNorm) * u_area.w;

          vec2 clip = vec2(
            (xPx / u_resolution.x) * 2.0 - 1.0,
            1.0 - (yPx / u_resolution.y) * 2.0
          );

          gl_Position = vec4(clip, 0.0, 1.0);
          gl_PointSize = u_pointSize;
          v_color = a_color;
        }`;

      const lineFragmentSource = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          gl_FragColor = v_color;
        }`;

      const pointFragmentSource = `
        precision mediump float;

        varying vec4 v_color;
        uniform int u_shape;

        void main() {
          vec2 p = gl_PointCoord - vec2(0.5, 0.5);
          float d = length(p);
          if (d > 0.5) discard;
          if (u_shape == 2 && d < 0.30) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
          } else {
            gl_FragColor = v_color;
          }
        }`;

      let lineProgram;
      let pointProgram;
      try {
        lineProgram = createProgram(gl, lineVertexSource, lineFragmentSource);
        pointProgram = createProgram(gl, pointVertexSource, pointFragmentSource);
      } catch (err) {
        console.error("WebGL setup failed", err);
        return null;
      }

      const lineLoc = {
        start: gl.getAttribLocation(lineProgram, "a_start"),
        end: gl.getAttribLocation(lineProgram, "a_end"),
        color: gl.getAttribLocation(lineProgram, "a_color"),
        side: gl.getAttribLocation(lineProgram, "a_side"),
        endpoint: gl.getAttribLocation(lineProgram, "a_endpoint"),
        time: gl.getUniformLocation(lineProgram, "u_time"),
        y: gl.getUniformLocation(lineProgram, "u_y"),
        area: gl.getUniformLocation(lineProgram, "u_area"),
        resolution: gl.getUniformLocation(lineProgram, "u_resolution"),
        lineWidth: gl.getUniformLocation(lineProgram, "u_lineWidth")
      };

      const pointLoc = {
        pos: gl.getAttribLocation(pointProgram, "a_pos"),
        color: gl.getAttribLocation(pointProgram, "a_color"),
        time: gl.getUniformLocation(pointProgram, "u_time"),
        y: gl.getUniformLocation(pointProgram, "u_y"),
        area: gl.getUniformLocation(pointProgram, "u_area"),
        resolution: gl.getUniformLocation(pointProgram, "u_resolution"),
        pointSize: gl.getUniformLocation(pointProgram, "u_pointSize"),
        shape: gl.getUniformLocation(pointProgram, "u_shape")
      };

      const renderer = {
        originMs: Date.now(),
        buffers: {},
        rebuild,
        render
      };

      function makeLineBuffer(vertices, starts) {
        const buffer = gl.createBuffer();
        const data = new Float32Array(vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return { buffer, segmentCount: starts.length, starts: new Float32Array(starts) };
      }

      function makePointBuffer(vertices, times) {
        const buffer = gl.createBuffer();
        const data = new Float32Array(vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return { buffer, count: times.length, times: new Float32Array(times) };
      }

      function deleteDataset(dataset) {
        if (dataset?.buffer) gl.deleteBuffer(dataset.buffer);
      }

      function replaceBuffers(next) {
        for (const key of Object.keys(renderer.buffers)) deleteDataset(renderer.buffers[key]);
        renderer.buffers = next;
      }

      function pointMin(point) {
        return (point.t - renderer.originMs) / 60000;
      }

      function pushLineVertex(out, startMin, startY, endMin, endY, rgba, side, endpoint) {
        out.push(
          startMin, startY,
          endMin, endY,
          rgba[0], rgba[1], rgba[2], rgba[3],
          side,
          endpoint
        );
      }

      function pushSegment(out, startMin, startY, endMin, endY, rgba) {
        // Two triangles forming a screen-space quad. This avoids gl.lineWidth(),
        // which is effectively fixed at 1 px in many browser/GPU combinations.
        pushLineVertex(out, startMin, startY, endMin, endY, rgba, -1, 0);
        pushLineVertex(out, startMin, startY, endMin, endY, rgba, -1, 1);
        pushLineVertex(out, startMin, startY, endMin, endY, rgba,  1, 1);
        pushLineVertex(out, startMin, startY, endMin, endY, rgba, -1, 0);
        pushLineVertex(out, startMin, startY, endMin, endY, rgba,  1, 1);
        pushLineVertex(out, startMin, startY, endMin, endY, rgba,  1, 0);
      }

      function addSolidSegment(segments, a, b, rgba) {
        const startMin = pointMin(a);
        const endMin = pointMin(b);
        if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) return;
        segments.push({
          start: Math.min(startMin, endMin),
          values: [startMin, a.y, endMin, b.y, rgba]
        });
      }

      function addDashedSegment(segments, a, b, rgba) {
        const totalMin = Math.max(0.001, (b.t - a.t) / 60000);
        const dashMin = 9;
        const gapMin = 5;
        const cycleMin = dashMin + gapMin;

        for (let start = 0; start < totalMin; start += cycleMin) {
          const end = Math.min(totalMin, start + dashMin);
          if (end <= start) continue;

          const startRatio = start / totalMin;
          const endRatio = end / totalMin;
          const p1 = {
            t: a.t + (b.t - a.t) * startRatio,
            y: a.y + (b.y - a.y) * startRatio
          };
          const p2 = {
            t: a.t + (b.t - a.t) * endRatio,
            y: a.y + (b.y - a.y) * endRatio
          };
          addSolidSegment(segments, p1, p2, rgba);
        }
      }

      function buildLineDataset(groups, options = {}) {
        const segments = [];
        const maxGapMs = options.maxGapMs ?? 45 * 60 * 1000;
        const dashed = Boolean(options.dashed);
        const alpha = options.alpha ?? 1;
        const fixedColor = options.color || null;

        for (const [sensor, group] of groups) {
          const rgba = hexToRgba(fixedColor || colorForSensor(sensor), alpha);
          for (let i = 1; i < group.length; i++) {
            const a = group[i - 1];
            const b = group[i];
            if (b.t - a.t <= 0 || b.t - a.t > maxGapMs) continue;
            if (dashed) addDashedSegment(segments, a, b, rgba);
            else addSolidSegment(segments, a, b, rgba);
          }
        }

        segments.sort((a, b) => a.start - b.start);

        const vertices = [];
        const starts = [];
        for (const segment of segments) {
          const [startMin, startY, endMin, endY, rgba] = segment.values;
          starts.push(segment.start);
          pushSegment(vertices, startMin, startY, endMin, endY, rgba);
        }

        return makeLineBuffer(vertices, starts);
      }

      function buildPointDataset(points, alpha = 1) {
        const rows = [];
        for (const p of points) {
          const tMin = pointMin(p);
          if (!Number.isFinite(tMin)) continue;
          rows.push({ tMin, y: p.y, rgba: hexToRgba(colorForSensor(p.sensor), alpha) });
        }
        rows.sort((a, b) => a.tMin - b.tMin);

        const vertices = [];
        const times = [];
        for (const row of rows) {
          times.push(row.tMin);
          vertices.push(row.tMin, row.y, row.rgba[0], row.rgba[1], row.rgba[2], row.rgba[3]);
        }

        return makePointBuffer(vertices, times);
      }

      function rebuild() {
        renderer.originMs = state.cache.loadedStartMs ?? currentRange().startMs;

        replaceBuffers({
          streamLines: buildLineDataset(state.cache.streamGroups, { maxGapMs: 45 * 60 * 1000 }),
          historyLines: buildLineDataset(state.cache.historyGroups, { maxGapMs: 45 * 60 * 1000, alpha: 0.92, color: COLORS.history }),
          scansPoints: buildPointDataset(state.data.scans, 1)
        });
      }

      function lowerBoundFloat(values, target) {
        let lo = 0;
        let hi = values.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (values[mid] < target) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function upperBoundFloat(values, target) {
        let lo = 0;
        let hi = values.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (values[mid] <= target) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function bindLineDataset(dataset) {
        gl.bindBuffer(gl.ARRAY_BUFFER, dataset.buffer);
        gl.enableVertexAttribArray(lineLoc.start);
        gl.enableVertexAttribArray(lineLoc.end);
        gl.enableVertexAttribArray(lineLoc.color);
        gl.enableVertexAttribArray(lineLoc.side);
        gl.enableVertexAttribArray(lineLoc.endpoint);
        gl.vertexAttribPointer(lineLoc.start, 2, gl.FLOAT, false, 40, 0);
        gl.vertexAttribPointer(lineLoc.end, 2, gl.FLOAT, false, 40, 8);
        gl.vertexAttribPointer(lineLoc.color, 4, gl.FLOAT, false, 40, 16);
        gl.vertexAttribPointer(lineLoc.side, 1, gl.FLOAT, false, 40, 32);
        gl.vertexAttribPointer(lineLoc.endpoint, 1, gl.FLOAT, false, 40, 36);
      }

      function drawLineDataset(dataset, startMin, endMin, lineWidthPx) {
        if (!dataset || !dataset.segmentCount) return;

        const leftPadMin = 60;
        const firstSegment = lowerBoundFloat(dataset.starts, startMin - leftPadMin);
        const lastSegment = upperBoundFloat(dataset.starts, endMin);
        const segmentCount = Math.max(0, lastSegment - firstSegment);
        if (!segmentCount) return;

        bindLineDataset(dataset);
        gl.uniform1f(lineLoc.lineWidth, Math.max(1, lineWidthPx));
        gl.drawArrays(gl.TRIANGLES, firstSegment * 6, segmentCount * 6);
      }

      function bindPointDataset(dataset) {
        gl.bindBuffer(gl.ARRAY_BUFFER, dataset.buffer);
        gl.enableVertexAttribArray(pointLoc.pos);
        gl.enableVertexAttribArray(pointLoc.color);
        gl.vertexAttribPointer(pointLoc.pos, 2, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(pointLoc.color, 4, gl.FLOAT, false, 24, 8);
      }

      function drawPointDataset(dataset, startMin, endMin, shape, pointSizeCss, dpr) {
        if (!dataset || !dataset.count) return;

        const firstPoint = lowerBoundFloat(dataset.times, startMin);
        const lastPoint = upperBoundFloat(dataset.times, endMin);
        const pointCount = Math.max(0, lastPoint - firstPoint);
        if (!pointCount) return;

        bindPointDataset(dataset);
        gl.uniform1i(pointLoc.shape, shape);
        gl.uniform1f(pointLoc.pointSize, pointSizeCss * dpr);
        gl.drawArrays(gl.POINTS, firstPoint, pointCount);
      }

      function setSharedUniforms(programLoc, startMin, endMin, area, yDom, width, height) {
        gl.uniform2f(programLoc.time, startMin, endMin);
        gl.uniform2f(programLoc.y, yDom.min, yDom.max);
        gl.uniform4f(programLoc.area, area.x, area.y, area.w, area.h);
        gl.uniform2f(programLoc.resolution, width, height);
      }

      function render(area, yDom, visible) {
        const glDpr = state.resize.glDpr || Math.min(window.devicePixelRatio || 1, 1);
        const visualWidth = area.w;
        const height = area.h;
        const overscan = state.webglOverscanWindows || 3;
        const renderWidth = visualWidth * overscan;
        const { startMs, endMs } = currentRange();
        const windowMs = endMs - startMs;
        const centerMs = (startMs + endMs) / 2;
        const renderStartMs = centerMs - (windowMs * overscan) / 2;
        const renderEndMs = centerMs + (windowMs * overscan) / 2;
        const startMin = (renderStartMs - renderer.originMs) / 60000;
        const endMin = (renderEndMs - renderer.originMs) / 60000;
        const lineWidth = curveThicknessPx();
        const glArea = {
          x: 0,
          y: 0,
          w: renderWidth,
          h: height,
          width: renderWidth,
          height
        };

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.SCISSOR_TEST);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(lineProgram);
        setSharedUniforms(lineLoc, startMin, endMin, glArea, yDom, renderWidth, height);

        if (visible.history) {
          drawLineDataset(renderer.buffers.historyLines, startMin, endMin, Math.max(1.5, lineWidth * 0.65));
        }

        if (visible.stream) {
          drawLineDataset(renderer.buffers.streamLines, startMin, endMin, lineWidth);
        }

        gl.useProgram(pointProgram);
        setSharedUniforms(pointLoc, startMin, endMin, glArea, yDom, renderWidth, height);

        if (visible.scans) {
          drawPointDataset(renderer.buffers.scansPoints, startMin, endMin, 1, Math.max(9, curveThicknessPx() * 2.3), glDpr);
        }

        gl.disable(gl.SCISSOR_TEST);
      }

      return renderer;
    }

    function draw(options = {}) {
      resizeCanvas();

      const fast = Boolean(options.fast);
      const area = getPlotArea();
      const yDom = fast && state.lastYDomain ? state.lastYDomain : yDomainVisible();
      if (!fast) state.lastYDomain = yDom;
      const scales = createScales(area, yDom);

      resetPlotTransform();
      state.scrollRenderBaseCenterMs = state.centerMs;

      if (glRenderer) {
        glRenderer.render(area, yDom, {
          stream: els.showStream.checked,
          scans: els.showScans.checked,
          history: els.showHistory.checked
        });
      } else {
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, area.width, area.height);
      }

      // The previous drawMovingAmounts(...) call referenced no defined function.
      // That stopped draw() after the WebGL curve was rendered, leaving the
      // 2D overlay canvas blank until drag scrolling called drawOverlayForCurrentRange().

      // Always repaint the 2D overlay after the WebGL curve. A fast redraw can
      // happen during first load, auto-refresh, resize, or option-panel layout
      // changes; if it exits here, the curve is visible but the grid/axes/text
      // stay blank until the next pan forces drawOverlayForCurrentRange().
      drawGrid(area, yDom, scales);
      drawNoData(area);
      drawAmountsOverlay(area, scales, yDom);
      drawCurrentGlucoseLabel(area, scales);
      drawHover(area, scales, yDom);
    }

    function pan(fraction, options = {}) {
      if (!options.keepLiveFollow) leaveLiveFollowNow();
      const before = state.centerMs;
      state.centerMs = clampCenterToDataBounds(state.centerMs + state.windowMs * fraction);
      const changed = Math.abs(state.centerMs - before) > 0.5;

      if (options.deferUi) {
        scheduleViewportUiUpdate();
        if (changed) updateCompositedPan();
        scheduleFullDraw();
        schedulePrefetchData(120);
      } else {
        updateViewportUiNow();
        requestDraw();
        schedulePrefetchData(120);
      }
    }

    function zoom(factor) {
      leaveLiveFollowNow();

      state.windowMs = Math.max(
        60 * 60 * 1000,
        Math.min(14 * 24 * 60 * 60 * 1000, state.windowMs * factor)
      );

      const hours = state.windowMs / 3600000;
      const options = Array.from(els.windowHours.options).map(o => Number(o.value));
      const nearest = options.reduce((best, v) => Math.abs(v - hours) < Math.abs(best - hours) ? v : best, options[0]);
      els.windowHours.value = String(nearest);
      state.windowMs = nearest * 3600000;
      applyDataScrollBounds();
      updateDateInputsNow();

      updateSummary();
      requestDraw();
      scheduleLoadData();
    }

    function jumpToNow() {
      setLiveFollowNow(true);

      state.centerMs = liveFollowCenterMs();
      state.lastAutoRefreshFetchMs = 0;
      updateDateInputsNow();
      updateSummary();
      requestDraw();
      clearLoadedCacheRange();
      loadData({ force: true });
    }

    function goToSelectedDate() {
      leaveLiveFollowNow();

      const selectedStartMs = getSelectedDateTimeMs();

      state.windowMs = Number(els.windowHours.value) * 3600000;
      state.centerMs = clampCenterToDataBounds(selectedStartMs + state.windowMs / 2);

      updateSummary();
      requestDraw();
      clearLoadedCacheRange();
      loadData({ force: true });
    }

    function handleUnitChange() {

      const oldUnit = state.unit;
      const newUnit = els.unit.value;

      if (oldUnit !== newUnit) {
        if (newUnit === "mg/dL") {
          els.lowLimit.value = "70";
          els.highLimit.value = "180";
          els.graphMin.value = "40";
          els.graphMax.value = "200";
        } else {
          els.lowLimit.value = "3.9";
          els.highLimit.value = "10.0";
          els.graphMin.value = "2";
          els.graphMax.value = "11";
        }
      }

      state.unit = newUnit;
      clearLoadedCacheRange();
      loadData({ force: true });
    }

    function refreshAfterLayoutChange() {
      requestFullDrawAfterLayout();
      setTimeout(requestFullDrawAfterLayout, 80);
      setTimeout(requestFullDrawAfterLayout, 250);
    }

    function setControlsCollapsed(collapsed, options = {}) {
      state.controlsCollapsed = Boolean(collapsed);
      document.body.classList.toggle("controls-collapsed", state.controlsCollapsed);
      if (els.toggleOptionsBtn) {
        const label = state.controlsCollapsed ? "Show options" : "Hide options";
        els.toggleOptionsBtn.textContent = label;
        els.toggleOptionsBtn.title = label;
        els.toggleOptionsBtn.setAttribute("aria-label", label);
      }
      if (options.persist !== false) {
        try {
          localStorage.setItem("jugglucoViewerControlsCollapsed", state.controlsCollapsed ? "1" : "0");
        } catch {}
      }
      refreshAfterLayoutChange();
    }

    function setToolbarCollapsed(collapsed, options = {}) {
      state.toolbarCollapsed = Boolean(collapsed);
      document.body.classList.toggle("toolbar-collapsed", state.toolbarCollapsed);
      if (els.toggleToolbarBtn) {
        const label = state.toolbarCollapsed ? "Show buttons" : "Hide buttons";
        els.toggleToolbarBtn.textContent = state.toolbarCollapsed ? "▾" : "▴";
        els.toggleToolbarBtn.title = label;
        els.toggleToolbarBtn.setAttribute("aria-label", label);
      }
      if (options.persist !== false) {
        try {
          localStorage.setItem("jugglucoViewerToolbarCollapsed", state.toolbarCollapsed ? "1" : "0");
        } catch {}
      }
      refreshAfterLayoutChange();
    }

    function defaultCompactLayout() {
      return window.matchMedia && window.matchMedia("(max-width: 900px), (max-height: 560px)").matches;
    }

    function restoreCollapsedPreferences() {
      const compact = defaultCompactLayout();

      try {
        const controlsPref = localStorage.getItem("jugglucoViewerControlsCollapsed");
        setControlsCollapsed(controlsPref === null ? compact : controlsPref === "1", { persist: controlsPref !== null });
      } catch {
        setControlsCollapsed(compact, { persist: false });
      }

      try {
        const toolbarPref = localStorage.getItem("jugglucoViewerToolbarCollapsed");
        setToolbarCollapsed(toolbarPref === null ? compact : toolbarPref === "1", { persist: toolbarPref !== null });
      } catch {
        setToolbarCollapsed(compact, { persist: false });
      }
    }

    function autoRefreshTick() {
      if (!els.autoRefresh.checked || state.drag) return;

      const now = Date.now();

      if (state.liveFollowNow) {
        // Live-follow mode is entered explicitly by pressing Now. In this mode
        // the viewport tracks the clock. Any manual pan/drag/wheel/zoom leaves
        // this mode so refreshes no longer move previously displayed points.
        state.centerMs = liveFollowCenterMs(now);
        updateDateInputsNow();
        updateSummary();

        updateCompositedPan();
        scheduleFullDraw(120);
      } else if (!isCurrentTimeInOrNearView()) {
        // Manual historical view: do not fetch repeatedly for ranges that are
        // clearly not around the current sensor data.
        return;
      }

      const fetchDue = now - state.lastAutoRefreshFetchMs >= 30 * 1000;
      const cacheNeedsExtension = !isCurrentVisibleRangeLoaded(0.25);

      if (!state.loading && (fetchDue || cacheNeedsExtension)) {
        state.lastAutoRefreshFetchMs = now;
        loadData({ force: true, quiet: true });
      }
    }

    function installAutoRefresh() {
      clearInterval(state.autoTimer);
      state.lastAutoRefreshFetchMs = 0;
      state.autoTimer = setInterval(autoRefreshTick, 5 * 1000);
      autoRefreshTick();
    }

    function attachEvents() {
      els.loadBtn.addEventListener("click", () => {
        clearLoadedCacheRange();
        loadData({ force: true });
      });
      els.showToken.addEventListener("change", () => {
        els.token.type = els.showToken.checked ? "text" : "password";
      });
      els.goDateBtn.addEventListener("click", goToSelectedDate);
      els.todayDateBtn.addEventListener("click", () => {
        els.dateToView.value = localDateValue();
        els.timeOnDate.value = "00:00";
        goToSelectedDate();
      });
      els.dateToView.addEventListener("change", goToSelectedDate);
      els.timeOnDate.addEventListener("change", goToSelectedDate);
      els.prevBtn.addEventListener("click", () => pan(-0.5));
      els.nextBtn.addEventListener("click", () => pan(0.5));
      els.zoomInBtn.addEventListener("click", () => zoom(0.5));
      els.zoomOutBtn.addEventListener("click", () => zoom(2));
      els.nowBtn.addEventListener("click", jumpToNow);
      els.toggleOptionsBtn.addEventListener("click", () => {
        setControlsCollapsed(!state.controlsCollapsed);
      });
      if (els.toggleToolbarBtn) {
        els.toggleToolbarBtn.addEventListener("click", () => {
          setToolbarCollapsed(!state.toolbarCollapsed);
        });
      }
      els.autoRefresh.addEventListener("change", () => {
        state.lastAutoRefreshFetchMs = 0;
        autoRefreshTick();
      });

      els.windowHours.addEventListener("change", () => {
        leaveLiveFollowNow();
        state.windowMs = Number(els.windowHours.value) * 3600000;
        applyDataScrollBounds();
        updateDateInputsNow();
        requestDraw();
        schedulePrefetchData(120);
      });

      els.unit.addEventListener("change", handleUnitChange);

      [
        els.showStream,
        els.showScans,
        els.showHistory,
        els.showAmounts,
        els.useCalibrated
      ].forEach(input => input.addEventListener("change", () => {
        clearLoadedCacheRange();
        state.lastYDomain = null;
        state.scrollRenderBaseCenterMs = null;
        resetPlotTransform();
        requestDraw();
        loadData({ force: true });
      }));

      [els.lowLimit, els.highLimit, els.graphMin, els.graphMax].forEach(input => {
        input.addEventListener("input", () => {
          state.lastYDomain = null;
          requestDraw();
        });
      });

      els.curveThickness.addEventListener("input", () => {
        requestDraw();
      });


      els.canvas.addEventListener("mousemove", event => {
        if (state.drag || state.wheelPanRequested) return;
        showTooltipFromEvent(event);
      });

      els.canvas.addEventListener("click", event => {
        if (state.drag || state.wheelPanRequested) return;
        showTooltipFromEvent(event);
      });

      els.canvas.addEventListener("mouseleave", () => {
        state.hover = null;
        els.tooltip.style.display = "none";
        requestDraw();
      });

      els.canvas.addEventListener("pointerdown", event => {
        els.canvas.setPointerCapture(event.pointerId);
        state.hover = null;
        els.tooltip.style.display = "none";
        state.drag = {
          startX: event.clientX,
          startY: event.clientY,
          latestX: event.clientX,
          latestY: event.clientY,
          centerMs: state.centerMs,
          frameRequested: false,
          moved: false
        };
      });

      function requestDragFrame() {
        if (!state.drag || state.drag.frameRequested) return;

        state.drag.frameRequested = true;
        requestAnimationFrame(() => {
          if (!state.drag) return;

          state.drag.frameRequested = false;
          const area = getPlotArea();
          const dx = state.drag.latestX - state.drag.startX;
          const dy = state.drag.latestY - state.drag.startY;

          if (!state.drag.moved && Math.hypot(dx, dy) < 5) return;

          if (!state.drag.moved) {
            state.drag.moved = true;
            els.canvas.classList.add("dragging");
            leaveLiveFollowNow();
          }

          state.centerMs = clampCenterToDataBounds(state.drag.centerMs - (dx / area.w) * state.windowMs);

          scheduleViewportUiUpdate();
          updateCompositedPan();
          scheduleFullDraw();
        });
      }

      els.canvas.addEventListener("pointermove", event => {
        if (!state.drag) {
          if (!state.wheelPanRequested) showTooltipFromEvent(event);
          return;
        }

        const events = typeof event.getCoalescedEvents === "function"
          ? event.getCoalescedEvents()
          : null;
        const lastEvent = events && events.length ? events[events.length - 1] : event;

        // Store only the newest pointer position. The redraw happens on the
        // next animation frame, so intermediate queued positions are skipped.
        state.drag.latestX = lastEvent.clientX;
        state.drag.latestY = lastEvent.clientY;
        requestDragFrame();
      });

      function endPointerPan(event) {
        if (!state.drag) return;

        try {
          if (els.canvas.hasPointerCapture(event.pointerId)) {
            els.canvas.releasePointerCapture(event.pointerId);
          }
        } catch {}

        const area = getPlotArea();
        const dx = state.drag.latestX - state.drag.startX;
        const dy = state.drag.latestY - state.drag.startY;
        const wasClick = !state.drag.moved && Math.hypot(dx, dy) < 5;

        if (!wasClick) {
          state.centerMs = clampCenterToDataBounds(state.drag.centerMs - (dx / area.w) * state.windowMs);
        }

        els.canvas.classList.remove("dragging");
        state.drag = null;

        if (wasClick) {
          showTooltipFromEvent(event);
          return;
        }

        updateViewportUiNow();
        requestDraw();
        schedulePrefetchData(80);
      }

      els.canvas.addEventListener("pointerup", endPointerPan);
      els.canvas.addEventListener("pointercancel", endPointerPan);

      els.canvas.addEventListener("wheel", event => {
        event.preventDefault();

        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          zoom(event.deltaY < 0 ? 0.5 : 2);
          return;
        }

        state.hover = null;
        els.tooltip.style.display = "none";

        // Trackpad/mouse wheels can emit many events per frame. Accumulate them
        // and move the viewport once per animation frame.
        const direction = event.deltaY > 0 ? 0.18 : -0.18;
        state.pendingWheelPan += direction;
        state.pendingWheelPan = Math.max(-1.5, Math.min(1.5, state.pendingWheelPan));
        requestWheelPan();
      }, { passive: false });

      window.addEventListener("resize", () => {
        requestFullDrawAfterLayout();
      });

      window.addEventListener("orientationchange", () => {
        refreshAfterLayoutChange();
      });

      if (window.ResizeObserver) {
        const observer = new ResizeObserver(() => requestFullDrawAfterLayout());
        observer.observe(els.chartWrap);
      }

      window.addEventListener("keydown", event => {
        if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          pan(-0.5);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          pan(0.5);
        } else if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          zoom(0.5);
        } else if (event.key === "-" || event.key === "_") {
          event.preventDefault();
          zoom(2);
        } else if (event.key === "Home") {
          event.preventDefault();
          jumpToNow();
        }
      });
    }

    glRenderer = createWebGlPlotRenderer(els.glCanvas);
    if (!glRenderer) {
      setStatus("WebGL is not available in this browser, so the accelerated plot layer cannot be shown.", true);
    }

    attachEvents();
    installAutoRefresh();
    restoreCollapsedPreferences();

    const didApplyUrlStart = applyUrlStartConfig();
    if(els.baseUrl && window.location.protocol === "http:" && window.location.port === "17580" && /^http:\/\/127\.0\.0\.1:17580\/?$/.test(els.baseUrl.value.trim())) {
      els.baseUrl.value = window.location.origin;
     }

    state.centerMs = liveFollowCenterMs();
    setDateInputsFromRangeStart();
    rebuildRenderCache();
    updateSensorLegend();
    draw();
    requestFullDrawAfterLayout();

    if (didApplyUrlStart) {
      loadData({ force: true, quiet: true });
    }
