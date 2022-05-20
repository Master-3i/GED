import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function TabSelect({ ProfileComponent, SecurityComponent }) {
  return (
    <Tabs variant={"soft-rounded"} colorScheme="blue">
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Security</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProfileComponent />
        </TabPanel>
        <TabPanel>
          <SecurityComponent />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
