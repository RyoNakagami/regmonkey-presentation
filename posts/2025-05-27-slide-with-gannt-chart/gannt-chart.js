const svgWidth = 1600; // Increase width
const svgHeight = 480; // Increase height
const rowheight = 40;
const fontsize = 20;
const label_fontsize = 16;
const fontweight = 800;
const name_width = 300;
const person_in_charge_width = 150;
const taskHeight = 20; // Height of each task bar
const label_padding = 8; // Padding for labels
const legend_padding = 10; // Padding for labels
const file_path = "./gannt_schedule.json";
const container_id = "d3-gannt-container";
const time_min = "2025-04-27";
const time_max = "2025-07-20";
const today = new Date();
// const today = "2025-12-15";

anychart.onDocumentReady(function () {
  // Load your custom JSON file and create the Gantt chart from it
  fetch(file_path)
    .then((response) => response.json())
    .then((json) => {
      var chart = anychart.fromJson(json);

      // Optional: Set container size
      const container = document.getElementById(container_id);
      container.style.width = svgWidth + "px";
      container.style.height = svgHeight + "px";

      // Set the container
      chart.splitterPosition(name_width + person_in_charge_width);
      chart.container(container_id);
      chart.getTimeline().tooltip(false);
      chart.defaultRowHeight(rowheight);
      chart.headerHeight(80);

      // set barsize
      chart.getTimeline().tasks().height(taskHeight);

      // set colors and behind labels
      var grouptask = chart.getTimeline().groupingTasks();
      grouptask.height(20);
      grouptask.fill("transparent");
      grouptask.stroke("transparent");
      grouptask.progress().fill(function () {
        if (this.item && this.item.get) {
          this.item.set("progressValue", "100%"); 
          const isStarted = this.item.get("isStarted");
          const isFinished = this.item.get("isFinished");
          if (isFinished === true) {
            return "#0E3666"; // Highlight color for finished tasks
          } else if (isStarted === true) {
            return "#1976d2"; // Highlight color for started tasks
          }
        }
        return "#DEDEDE"; // Default style otherwise
      });

      grouptask.labels().useHtml(true);
      grouptask.labels().fontColor("#1a1a1a");
      grouptask.labels().fontSize(label_fontsize);
      grouptask.labels().padding();
      grouptask.labels().format(function () {
        if (this.item && this.item.get) {
          const endDate = new Date(this.item.get("actualEnd"));
          endDate.setHours(0, 0, 0, 0); // Normalize end date to midnight
          const isFinished = this.item.get("isFinished");
          const note = this.item.get("note");

          if (isFinished === true) {
            return note;
          } else if (endDate < today) {
            // Calculate days difference
            const diffTime = Math.abs(endDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              "<span style='color:#D31804; font-weight: bold;'>" +
              diffDays +
              "日遅延</span> " +
              note
            );
          } else {
            return note; // Default style otherwise
          }
        }
      });

      // set label y axis
      grouptask.offset((rowheight - taskHeight) / 2); // Adjust the offset to center the label vertically

      // set isStarted task color and behind labels
      var task_items = chart.getTimeline().tasks();
      task_items.stroke("transparent").fill(function () {
        if (this.item && this.item.get) {
          const isStarted = this.item.get("isStarted");
          const isFinished = this.item.get("isFinished");
          if (isFinished === true) {
            return "#0E3666"; // Highlight color for finished tasks
          } else if (isStarted === true) {
            return "#1976d2"; // Highlight color for started tasks
          }
        }
        return "#DEDEDE"; // Default style otherwise
      });

      var task_label = task_items.labels();
      task_label.useHtml(true);
      task_label.fontColor("#1a1a1a");
      task_label.fontSize(label_fontsize);
      task_label.padding(label_padding);
      task_label.format(function () {
        if (this.item && this.item.get) {
          const endDate = new Date(this.item.get("actualEnd"));
          endDate.setHours(0, 0, 0, 0); // Normalize end date to midnight
          const isFinished = this.item.get("isFinished");
          const note = this.item.get("note");

          if (isFinished === true) {
            return note;
          } else if (endDate < today) {
            // Calculate days difference
            const diffTime = Math.abs(endDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              "<span style='color:#D31804; font-weight: bold;'>" +
              diffDays +
              "日遅延</span> " +
              note
            );
          } else {
            return note; // Default style otherwise
          }
        }
      });

      // set task labels
      var datagrid = chart.dataGrid();
      datagrid.column(0).enabled(false);

      var datagrid_title = datagrid.column(1);
      datagrid_title.title().fontWeight(fontweight);
      datagrid_title.title().fontColor("#1a1a1a");
      datagrid_title.title().fontSize(fontsize);
      datagrid_title.labels().fontSize(fontsize);
      datagrid_title.labels().useHtml(true);
      datagrid_title.labels().fontColor("#1a1a1a");
      datagrid_title.width(name_width);

      var datagrid_title2 = datagrid.column(2);
      datagrid_title2.width(person_in_charge_width);
      datagrid_title2.labels().useHtml(true);
      datagrid_title2.title("担当");
      datagrid_title2.title().fontWeight(fontweight);
      datagrid_title2.title().fontColor("#1a1a1a");
      datagrid_title2.title().fontSize(fontsize);
      datagrid_title2.labels().fontColor("#1a1a1a");
      datagrid_title2.labels().fontSize(fontsize);
      datagrid_title2
        .labels()
        .format("<div style='padding-left:0.5em;'>{%personInCharge}</div>");

      // configure the timeline header
      var timeline = chart.getTimeline();

      // base Setup
      timeline.rowHoverFill("#ffd54f 0.3");
      timeline.rowSelectedFill("#ffd54f 0.3");

      // set the minimum and maximum values of the scale
      timeline.scale().zoomLevels([["week", "month"]]);
      timeline.scale().minimum(time_min);
      timeline.scale().maximum(time_max);

      // header font
      var header = chart.getTimeline().header();
      header.fontColor("#1a1a1a");
      header.fontWeight(fontweight);
      header.fontSize(fontsize);

      timeline.milestones().labels().padding(label_padding);
      timeline.milestones().labels().fontSize(label_fontsize);

      // marker
      // create today vertical line
      var marker_today = chart.getTimeline().lineMarker(0);
      marker_today.zIndex(0); // Ensure the marker is on top of other elements

      // set values of markers
      marker_today.value(today);
      marker_today.stroke({
        // Thickness Color     Dash Length
        thickness: 4,
        color: "#FFD700",
        dash: "5 2", // "5 5" creates a pattern of 5px dash, 5px gap
      });

      // milestone custom label
      var headerHeight = chart.headerHeight(); // Get the header height (80 in your case)
      // create two text markers
      var marker_milestone_1 = chart.getTimeline().textMarker(0);
      marker_milestone_1.value("2025-07-06");
      marker_milestone_1.fontSize(label_fontsize); // Ensure the marker is on top of other elements
      marker_milestone_1.useHtml(true);
      marker_milestone_1.text("v1.0リリース");
      marker_milestone_1.rotation(0);

      // Position at first row
      marker_milestone_1.offsetY(-headerHeight - 1.6 * rowheight); // Position at middle of first row
      marker_milestone_1.offsetX(5);

      // Set time scale to show months and weeks
      var legend = chart.legend();
      legend.enabled(true);
      legend.position("top"); // or 'top', 'left', 'right'
      legend.itemsLayout("horizontal"); // or 'vertical'
      legend.align("left"); // or 'left', 'right'
      legend.padding(legend_padding);
      legend.fontSize(fontsize);
      legend.fontColor("#1a1a1a");

      // Optional: Customize legend items
      legend.items([
        { text: "完了タスク", iconType: "square", iconFill: "#0E3666" },
        { text: "着手済みタスク", iconType: "square", iconFill: "#1976d2" },
        { text: "未着手タスク", iconType: "square", iconFill: "#DEDEDE" },
        {
          text: "本日",
          iconType: "line",
          iconStroke: {
            thickness: 5,
            color: "#FFD700",
            dash: "5 5",
          },
        },
      ]);

      // Draw the chart
      chart.draw();
      chart.fitAll();
    })
    .catch((error) => {
      console.error("Error loading Gantt chart JSON:", error);
    });
});
