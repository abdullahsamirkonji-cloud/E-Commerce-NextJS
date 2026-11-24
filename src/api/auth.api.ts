export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export async function registerUser(values: RegisterValues) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/signup`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function forgotPassword(email: string) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function verifyResetCode(resetCode: string) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`,
    {
      method: "POST",
      body: JSON.stringify({ resetCode }),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function resetPassword(email: string, newPassword: string) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/resetPassword`,
    {
      method: "PUT",
      body: JSON.stringify({ email, newPassword }),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function changeUserPassword(
  token: string,
  values: { currentPassword: string; password: string; rePassword: string },
) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        token,
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function updateUserData(
  token: string,
  values: { name: string; email: string; phone: string },
) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/updateMe/`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        token,
        "content-type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}
