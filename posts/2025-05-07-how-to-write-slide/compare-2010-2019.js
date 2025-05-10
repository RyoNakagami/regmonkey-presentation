if (typeof setupSeries === 'undefined') {
    function setupSeries(series, name, color, hoveredColor) {
        series.name(name).stroke("2 #fff 1").fill(color);
        series.hovered().stroke("1 #fff 1").fill(hoveredColor);
    }
}
anychart.onDocumentReady(function () {
  // Sample annual sales data from 2010 to 2020
  let rawData = [
    ["2010", 102, 38, 140],
    ["2019", 141, 25, 167],
  ];

  let dataSet = anychart.data.set(rawData);
  let cost_series = dataSet.mapAs({ x: 0, value: 1 });
  let profit_series = dataSet.mapAs({ x: 0, value: 2 });

  // create a column chart instance
  let chart = anychart.column();

  // stack values on y scale.
  chart.yScale().stackMode("value");

  // store series
  let series;
  series = chart.column(cost_series);
  series.id("cost_series"); // Fixed ID for cost series

  setupSeries(series, "費用", "#A9A9A9", "#A9A9A9");
  series
    .labels()
    .enabled(true)
    .format("{%Value}") // You can also use "{%y}" for the Y value
    .position("center") // Optional: "inside", "outside", "center"
    .anchor("center") // Aligns label within bar
    .fontColor("white") // Good contrast inside a colored bar
    .fontSize(20);

  series = chart.column(profit_series);
  series.id("profit_series"); // Fixed ID for profit setupSeries

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

  chart.pointWidth("40%");
  // chart.xAxis().title("Year");
  chart.xAxis().stroke({ color: "black", thickness: 1 });
  chart.yAxis().stroke({ color: "black", thickness: 1 });
  chart.yAxis().title("Sales (in millions)").padding([0, 0, 10, 0]); // Adding the unit to the
  // Y-axis title
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
    .fontFamily("MeiryoUI")
    .fontSize(26)
    .fontColor("#575757")
    .fontWeight(200)
    .text("売上と営業利益額の推移(2010 vs 2019年)");

  //legend
  chart
    .legend()
    .enabled(true)
    .fontSize(20) // Change text size
    .iconSize(20) // Change icon size
    .padding(10) // Padding inside legend
    .margin(10); // Margin around legend
  chart.legend(true);

  // union
  chart.tooltip().displayMode("union");
  chart.tooltip().titleFormat(function (e) {
    return this.x + " - " + this.points[0].getStat("categoryYSum");
  });

  chart.container("compare-2010-2019");
  chart.draw(); // Finally, draw the chart
});
