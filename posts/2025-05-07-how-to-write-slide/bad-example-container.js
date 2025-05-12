if (typeof setupSeries === 'undefined') {
    function setupSeries(series, name, color, hoveredColor) {
        series.name(name).stroke("2 #fff 1").fill(color);
        series.hovered().stroke("1 #fff 1").fill(hoveredColor);
    }
}

function drawSalesChart(containerId) {
  // Sample annual sales data from 2010 to 2020
  let dataSet = anychart.data.set([
    ["2010", 102, 38],
    ["2011", 114, 37],
    ["2012", 119, 38],
    ["2013", 122, 35],
    ["2014", 126, 33],
    ["2015", 131, 32],
    ["2016", 134, 31],
    ["2017", 137, 28],
    ["2018", 138, 26],
    ["2019", 141, 25],
  ]);
  // Create stacked series
  let cost_series = dataSet.mapAs({ x: 0, value: 1 });
  let profit_series = dataSet.mapAs({ x: 0, value: 2 });

  // create a column chart instance
  let chart = anychart.column();

  // stack values on y scale.
  chart.yScale().stackMode("value");

  // store series
  let series;
  series = chart.column(cost_series);
  setupSeries(series, "費用", "#A9A9A9", "#D31804");
  series
    .labels()
    .enabled(true)
    .format("{%Value}") // You can also use "{%y}" for the Y value
    .position("center") // Optional: "inside", "outside", "center"
    .anchor("center") // Aligns label within bar
    .fontColor("white") // Good contrast inside a colored bar
    .fontSize(20);

  series = chart.column(profit_series);
  setupSeries(series, "営業利益", "#0E3666", "#0E3666");
  series
    .labels()
    .enabled(true)
    .format("{%Value}") // You can also use "{%y}" for the Y value
    .position("center") // Optional: "inside", "outside", "center"
    .anchor("center") // Aligns label within bar
    .fontColor("white") // Good contrast inside a colored bar
    .fontSize(20);

  // Add title and axis labels
  chart.xAxis().title().fontSize(20).fontWeight("bold").fontFamily("MeiryoUI");
  chart.yAxis().title().fontSize(20).fontWeight("bold").fontFamily("MeiryoUI");
  // chart.xAxis().title("Year");
  chart.yAxis().title("Sales (in millions)").padding([0, 0, 10, 0]); // Adding the unit to the
  chart.xAxis().stroke({ color: "black", thickness: 1 });
  chart.yAxis().stroke({ color: "black", thickness: 1 });

  // Enable legend
  // label config
  var label_x = chart.xAxis().labels();
  var label_y = chart.yAxis().labels();
  label_x.fontFamily("MeiryoUI");
  label_y.fontFamily("MeiryoUI");
  label_x.fontSize(20);
  label_y.fontSize(20);
  label_x.fontColor("#1a1a1a");
  label_y.fontColor("#1a1a1a");

  // title config
  var title = chart.title();
  title
    .enabled(true)
    .fontSize(22)
    .fontFamily("MeiryoUI")
    .fontColor("black")
    .fontWeight(200)
    .text("売上と営業利益額の推移(2010~2019年)");

  chart.legend(true);

  // Set container and draw
  chart.container(containerId);
  chart.draw();
}

anychart.onDocumentReady(function () {
  drawSalesChart("bad-example-container");
});
