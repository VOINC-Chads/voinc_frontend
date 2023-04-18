import { Fragment } from "react";
import "./App.css"

const ColoredCircle = ({ color }) => {

    const styles = { backgroundColor: color };
  
    return color ? (
      <Fragment>
        <span className="colored-circle" style={styles} />
      </Fragment>
    ) : null;
  };
  
  export default ColoredCircle;