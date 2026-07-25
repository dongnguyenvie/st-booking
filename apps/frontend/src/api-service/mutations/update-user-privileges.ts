import { gqlClient } from '../graphql-client';

interface UpdateUserPrivilegesInput {
  userId: string;
  privileges: number[];
}

interface UpdateUserPrivilegesResponse {
  updateUserPrivileges: {
    data: {
      id: string;
      email: string;
      name?: string | null;
      privileges?: number[] | null;
    };
  };
}

const UPDATE_USER_PRIVILEGES_MUTATION = `
  mutation UpdateUserPrivileges($input: UpdateUserPrivilegesInput!) {
    updateUserPrivileges(input: $input) {
      data {
        id
        email
        name
        privileges
      }
    }
  }
`;

/** Update a user's privileges — admin only */
export async function updateUserPrivileges(input: UpdateUserPrivilegesInput) {
  const data = await gqlClient.request<UpdateUserPrivilegesResponse>(UPDATE_USER_PRIVILEGES_MUTATION, {
    input,
  });
  return data.updateUserPrivileges.data;
}
