import React from "react";
import posed, { PoseGroup } from "react-pose";

const timeout = 200;

class Transition extends React.PureComponent {
  render() {
    const { children, location } = this.props;

    const RoutesContainer = posed.div({
      enter: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        delay: timeout,
        delayChildren: timeout,
      },
      exit: {
        opacity: 0,
        filter: "blur(20px)",
        y: 30,
      },
    });

    return (
      // <div style={{ position: 'relative', height: '100%' }}>
        // <div style={{ position: 'absolute', width: '100%', height: '100%', overflowY: 'auto' }}>
          <PoseGroup>
            <RoutesContainer key={location.pathname}>{children}</RoutesContainer>
          </PoseGroup>
        // </div>
      // </div>
    );
  }
}

export default Transition;
