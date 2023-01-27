import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function BillingTab({ PlanComponent, HistoryComponent }) {
  return (
    <Tabs variant={"soft-rounded"} colorScheme="blue">
      <TabList>
        <Tab>Plan</Tab>
        <Tab>History</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <PlanComponent />
        </TabPanel>
        <TabPanel>
          <HistoryComponent />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
