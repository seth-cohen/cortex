import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

const PopoverHOC = React.forwardRef((props, ref) => {
  useEffect(() => {
    props.scripts.forEach((s) => new Function(s)());
  });
  return (
    <Popover id="popover-content" ref={ref} {...props}>
      <div className="pageContentPopover">
        <Popover.Body dangerouslySetInnerHTML={{ __html: props.content }} />
      </div>
    </Popover>
  );
});

function NodeLink(props) {
  const [pageContent, setPageContent] = useState(null);
  const [scripts, setScripts] = useState([]);

  useEffect(async () => {
    const res = await fetch(props.url);
    const page = await res.text();

    const container = document.createElement("template");
    container.innerHTML = page;
    const pageContent = container.content.querySelector(".page");
    const scripts = container.content.querySelectorAll("script");

    setScripts(
      Array.from(scripts)
        .map((s) => {
          if (!!s.dataset.forReact) {
            return s.text;
          } else {
            return null;
          }
        })
        .filter((s) => s !== null)
    );
    setPageContent(pageContent.innerHTML);
  }, []);
  return (
    <>
      <OverlayTrigger
        placement="auto"
        trigger={["hover", "focus"]}
        overlay={
          <PopoverHOC
            content={pageContent}
            name={props.name}
            scripts={scripts}
          />
        }
      >
        <a href={props.url}>
          {props.name} <FontAwesomeIcon icon={faQuestion} size="xs" />
        </a>
      </OverlayTrigger>
    </>
  );
}

window.mountModal = (elementId, data) => {
  ReactDOM.render(<NodeLink {...data} />, document.getElementById(elementId));
};
