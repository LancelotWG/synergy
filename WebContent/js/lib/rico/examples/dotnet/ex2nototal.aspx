<%@ Page Language="VB" ResponseEncoding="iso-8859-1" Debug="true" %>
<%@ Register TagPrefix="Rico" TagName="LiveGrid" Src="../../plugins/dotnet/LiveGrid.ascx" %>
<%@ Register TagPrefix="Rico" TagName="Column" Src="../../plugins/dotnet/GridColumn.ascx" %>


<script runat="server">

Sub Page_Load(Sender As object, e As EventArgs)
  ex2.sqlQuery="select OrderID,CustomerID,ShipName,ShipCity,ShipCountry,OrderDate,ShippedDate from orders order by OrderID"
  ex2.requestParameters.Add("get_total","false")
End Sub

</script>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Rico LiveGrid-Example 2</title>

<script src="../../src/min.rico.js" type="text/javascript"></script>
<link href="../../src/css/min.rico.css" type="text/css" rel="stylesheet" />
<link href="../../src/css/greenHdg.css" type="text/css" rel="stylesheet" />
<link href="../client/css/demo.css" type="text/css" rel="stylesheet" />

<style type="text/css">
div.ricoLG_cell {
  white-space:nowrap;
}
</style>
</head>
<body>
<Rico:LiveGrid runat='server' id='ex2'>
<GridColumns>
  <Rico:Column runat='server' heading='Order#' width='60' />
  <Rico:Column runat='server' heading='Customer#' width='60' />
  <Rico:Column runat='server' heading='Ship Name' width='150' />
  <Rico:Column runat='server' heading='Ship City' width='120' />
  <Rico:Column runat='server' heading='Ship Country' width='90' />
  <Rico:Column runat='server' heading='Order Date' datatype='date' width='100' />
  <Rico:Column runat='server' heading='Ship Date' datatype='date' width='100' />
</GridColumns>
</Rico:LiveGrid>

</body>
</html>
