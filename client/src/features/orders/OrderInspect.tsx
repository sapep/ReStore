import { Typography, Button, Grid } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { Order } from "../../app/models/order";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";

interface Props {
  order: Order;
  setIsInspecting: (val: boolean) => void;
}

export default function OrderInspect(props: Props) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "1em" }}>
        <Typography variant="h4">
          Order #{props.order.id} - {props.order.orderStatus}
        </Typography>
        <Button variant="contained" onClick={() => props.setIsInspecting(false)}>Back to orders</Button>
      </div>
      <BasketTable items={props.order.orderItems as BasketItem[]} isBasket={false} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary subTotal={props.order.subTotal} />
        </Grid> 
      </Grid>
    </>
  );
}