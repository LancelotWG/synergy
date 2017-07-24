<%@ Page Language="VB" ResponseEncoding="iso-8859-1" Debug="true" %>
<%@ Register TagPrefix="Rico" TagName="LiveGrid" Src="../../plugins/dotnet/LiveGrid.ascx" %>
<%@ Register TagPrefix="Rico" TagName="Column" Src="../../plugins/dotnet/GridColumn.ascx" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Rico LiveGrid-Weather Example</title>

<script src="../../src/min.rico.js" type="text/javascript"></script>
<link href="../../src/css/min.rico.css" type="text/css" rel="stylesheet" />
<link href="../../src/css/greenHdg.css" type="text/css" rel="stylesheet" />
<link href="../client/css/demo.css" type="text/css" rel="stylesheet" />

<script type='text/javascript'>
function weathergrid_InitComplete() {
  var flag=$('flag').getElementsByTagName('IMG')[0];
  if (flag) {
    if (flag.src.match(/\/([A-Z]+)-flag.gif/)) {
      var country=RegExp.$1;
      //alert(country);
      weathergrid['buffer'].options.requestParameters = ['c='+country];
    }
  }
  weathergrid['buffer'].options.acceptAttr = ['style'];
  weathergrid['grid'].filterHandler();
}
</script>

<style type="text/css">
div.ricoLG_cell { white-space: nowrap; }
</style>
</head>

<body>

<table border='0' cellpadding='0' cellspacing='5' style='clear:both'><tr valign='top'>
<td id='flag'>
<script language="Javascript" src="http://map.geoup.com/geoup?template=flag"></script>
</td>
<td id='explanation'>The flag at left is generated by <a href='http://www.geobytes.com/'>geobytes.com</a> based on your IP address.
<a href='yahooWeather.php'>yahooWeather.php</a> is used as a proxy to gather data from <a href='http://weather.yahoo.com/'>Yahoo Weather</a>.
The weather data is delivered to the client via AJAX. 
During the AJAX request, any cities in the list that match the flag are highlighted in yellow and any freezing temperatures are colored blue.
Note that these styles are passed back in the AJAX response and incorporated into the grid dynamically.
</td></tr></table>

<Rico:LiveGrid runat='server' id='weathergrid' prefetchBuffer='false' dataProvider='yahooWeather.aspx' frozenColumns='1'>
<GridColumns>
  <Rico:Column runat='server' heading='City' width='120' />
  <Rico:Column runat='server' heading='Sunrise' width='70' />
  <Rico:Column runat='server' heading='Sunset' width='70' />
  <Rico:Column runat='server' heading='Currently' width='100' />
  <Rico:Column runat='server' heading='Temp' width='50' DataType='number' decPlaces='0' ClassName='alignright' suffix='&deg;C' />
  <Rico:Column runat='server' heading='Low' width='50' DataType='number' decPlaces='0' ClassName='alignright' suffix='&deg;C' />
  <Rico:Column runat='server' heading='High' width='50' DataType='number' decPlaces='0' ClassName='alignright' suffix='&deg;C' />
  <Rico:Column runat='server' heading='Forecast' width='150' />
  <Rico:Column runat='server' heading='As of' width='200' />
  <Rico:Column runat='server' heading='Source' width='60' />
</GridColumns>
</Rico:LiveGrid>

</body>
</html>
