import React, { Component } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class App extends Component {
  async getData() {
    let response = await fetch("https://dev.cong.appwifi.com/stat/client")
    response = await response.json()
    response = response.data
    return response
  } 

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;
    chart.dateFormatter.inputDateFormat = "x";
    
    this.getData().then(response => {
      return chart.data = response
    });
    // chart.dataSource.url = "https://dev.cong.appwifi.com/stat/client";

    let dateAxis  = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("hour", "[#746f6a]dd/MM/yyyy H:mm");
    dateAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.renderer.minGridDistance = 80;

    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = "[bold]Số lượng";
    columnSeries.dataFields.valueY = "num_sta";
    columnSeries.dataFields.dateX = "time";
    columnSeries.fill = am4core.color("#7cb5ec");

    columnSeries.columns.template.tooltipText = `[bold]{site} [#fff font-size: 15px]{name} vào {dateX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]`
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
    columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
    columnSeries.tooltip.label.textAlign = "middle";
    columnSeries.columns.template.width = 50;

    let hoverStateColumn = columnSeries.columns.template.states.create("hover");
    hoverStateColumn.properties.fillOpacity = 0.5;
    hoverStateColumn.properties.tension = 0.4;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.tensionX = 0.8;
    lineSeries.name = "[bold]Dung lượng";
    lineSeries.dataFields.valueY = "wlan_bytes";
    lineSeries.dataFields.dateX = "time";

    lineSeries.stroke = am4core.color("black");
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";

    let bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("black");
    bullet.tooltipText = "[bold]{site} [#fff font-size: 15px]{name} vào {dateX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    let circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.strokeWidth = 3;

    chart.legend = new am4charts.Legend();

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default App;