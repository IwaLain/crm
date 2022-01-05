import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { Link } from "react-router-dom";
import customersApi from "../../../js/api/customer";
import facilitiesApi from "../../../js/api/facilities";
import locationApi from "../../../js/api/locations";
import { useState } from "react";
import equipmentApi from "../../../js/api/equipment";

const Breadcrumbs = ({ breadcrumbs }) => {
  const [name, setName] = useState();

  return (
    <nav className="breadcrumbs">
      {breadcrumbs &&
        breadcrumbs.map(({ breadcrumb, match }, index) => {
          if (
            breadcrumb.key.includes("/customers/") &&
            parseInt(breadcrumb.props.children)
          ) {
            customersApi
              .getCustomer(breadcrumb.props.children)
              .then((customer) => {
                if (customer && customer.customer) {
                  setName(
                    customer.customer[Object.keys(customer.customer)[0]].name
                  );
                }
              });
          } else if (
            breadcrumb.key.includes("/facilities/") &&
            parseInt(breadcrumb.props.children)
          ) {
            facilitiesApi
              .getFacility(breadcrumb.props.children)
              .then((facility) => {
                if (facility && facility.facility)
                  setName(
                    facility.facility[Object.keys(facility.facility)[0]].name
                  );
              });
          } else if (
            breadcrumb.key.includes("/locations/") &&
            parseInt(breadcrumb.props.children)
          ) {
            locationApi
              .getLocation(breadcrumb.props.children)
              .then((location) => {
                if (location && location.location)
                  setName(location.location.name);
              });
          } else if (
            breadcrumb.key.includes("/equipment/") &&
            parseInt(breadcrumb.props.children)
          ) {
            equipmentApi
              .getEquipment(breadcrumb.props.children)
              .then((equipment) => {
                if (equipment && equipment.equipment)
                  setName(equipment.equipment.name);
              });
          }

          return (
            <div key={match.url} className="breadcrumbs__breadcrumb-item">
              <Link
                to={breadcrumb.key || ""}
                data-text={
                  parseInt(breadcrumb.props.children) ? name : breadcrumb
                }
                style={breadcrumb.key === "/" ? { pointerEvents: "none" } : {}}
              >
                {parseInt(breadcrumb.props.children) ? name : breadcrumb}
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
