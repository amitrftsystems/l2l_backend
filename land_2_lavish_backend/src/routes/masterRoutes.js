import express from "express";
import { addCustomer } from "../controllers/masterController/customer/addCustomer.js";
import { editCustomer } from "../controllers/masterController/customer/editCustomer.js";
import { getCustomers, getCustomerById, deleteCustomer } from "../controllers/masterController/customer/getCustomers.js";

import { addBank, getBanks, getBankById, updateBank, deleteBank } from "../controllers/masterController/bank.js";

import { addBroker, editBroker, getBroker, getBrokerById, deleteBroker } from "../controllers/masterController/broker.js";

import { addProject, updateProject, getProjects, getProjectById, deleteProject } from "../controllers/masterController/project.js";

import { addCoApplicant } from "../controllers/masterController/co-applicant.js";

import { addNewInstallmentPlan, addInstallmentDetails, getInstallmentPlans, getInstallmentPlanByName, updateInstallmentPlan, deleteInstallmentPlan } from "../controllers/masterController/plans.js";

import { addNewPLC, getPLC, getPLCById, updatePLC, deletePLC } from "../controllers/masterController/plc.js";

import { createProperty, updateProperty, getProperties, getPropertyById, deleteProperty } from "../controllers/masterController/property.js";

import { addNewPropertySize, getPropertySize, getPropertySizeById, updatePropertySize, deletePropertySize } from "../controllers/masterController/propertySize.js";

import { checkProject, checkOrCreateProperty, checkStockProperty,addStock } from "../controllers/masterController/stock/stock.js";





const router = express.Router();

// customer
router.post("/add-customer", addCustomer);
router.put("/customer/:id", editCustomer);
router.get("/get-customers", getCustomers);
router.get("/customer/:id", getCustomerById);
router.delete("/customer/:id", deleteCustomer);

// bank
router.post("/add-bank", addBank);
router.get("/get-banks", getBanks);
router.get("/bank/:id", getBankById);
router.put("/bank/:id", updateBank);
router.delete("/bank/:id", deleteBank);

// broker
router.post("/add-broker", addBroker);
router.put("/edit-broker/:id", editBroker);
router.get("/get-brokers", getBroker);
router.get("/get-broker/:id", getBrokerById);
router.delete("/broker/:id", deleteBroker);

// project
router.post("/add-project", addProject);
router.put("/project/:id", updateProject);
router.get("/get-projects", getProjects);
router.get("/projects/:id", getProjectById);
router.delete("/project/:id", deleteProject);

// co-applicant
router.post("/co-applicant", addCoApplicant);


// installment plan
router.post("/add-new-installment-plan", addNewInstallmentPlan);
router.post("/add-installment-details", addInstallmentDetails);
router.get("/get-installment-plan", getInstallmentPlans);
router.get("/get-installment-plan-by-name/:plan_name", getInstallmentPlanByName);
router.put("/update-installment-plan/:plan_name", updateInstallmentPlan);
router.delete("/delete-installment-plan/:plan_name", deleteInstallmentPlan)

// plc
router.post("/add-new-plc", addNewPLC);
router.get("/plcs", getPLC);
router.get("/plc/:id", getPLCById);
router.put("/plc/:id", updatePLC);
router.delete("/plc/:id", deletePLC);

// property
router.post("/property", createProperty);
router.put("/property/:id", updateProperty);
router.get("/get-property", getProperties);
router.get("/property/:id", getPropertyById);
router.delete("/property/:id", deleteProperty);

// property size
router.post("/add-new-property-size", addNewPropertySize);
router.get("/property-sizes", getPropertySize);
router.get("/property-size/:id", getPropertySizeById);
router.put("/property-size/:id", updatePropertySize);
router.delete("/property-size/:id", deletePropertySize);

// stock
router.post("/stock", addStock);
router.post("/stock/check-project", checkProject);
router.get("/stock/check-property", checkStockProperty);
router.post("/stock/check-stock-property", checkStockProperty);

export default router;