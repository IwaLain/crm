import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { Link } from "react-router-dom";
import "../../../scss/breadcrumbs.scss";
import { getCustomerAPI } from "../../../js/api/customer";
import { useState } from "react";

const Breadcrumbs = ({ breadcrumbs }) => {
  const [customerName, setCustomerName] = useState();

  return (
    <nav className="breadcrumbs">
      {breadcrumbs &&
        breadcrumbs.map(({ breadcrumb, match }, index) => {
          if (
            breadcrumb.key.includes("/dashboard/customers/") &&
            parseInt(breadcrumb.props.children)
          ) {
            getCustomerAPI(breadcrumb.props.children).then((customer) => {
              setCustomerName(customer[breadcrumb.props.children].name);
            });
          }

          return (
            <div key={match.url} className="breadcrumbs__breadcrumb-item">
              <Link to={match.url || ""}>
                {breadcrumb.key.includes(
                  "/dashboard/customers/" && parseInt(breadcrumb.props.children)
                )
                  ? customerName
                  : breadcrumb}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumbs__divider">-</span>
              )}
            </div>
          );
        })}
    </nav>
  );
};

export default withBreadcrumbs()(Breadcrumbs);
