import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

export const PoolListAccordian = ({ list }) => {
  return (
    <Accordion allowMultiple>
      {list.map((item, index) => {
        return (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {item.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <h5>Easy : {item.easyQN}</h5>
              <h5>Medium : {item.mediumQN}</h5>
              <h5>Hard : {item.hardQN}</h5>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};