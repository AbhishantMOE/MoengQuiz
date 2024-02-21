import { Flex, Checkbox } from "@chakra-ui/react";

const User = ({ user, onUserSelect, isChecked }) => {  
    return (
      <Flex>
        <Checkbox onChange={(e) => onUserSelect(user, e.target.checked)}  defaultChecked={isChecked ? true : false}>{user.name} </Checkbox>
      </Flex>
    )
};

export default User;