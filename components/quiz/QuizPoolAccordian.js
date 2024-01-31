import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

export const PoolListAccordian = ({ list }) => {
  // console.log("his is list", list);
  return (
    <Accordion allowMultiple>
      {list.map((item) => {
        return (
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
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
