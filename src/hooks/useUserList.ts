//用户列表管理
// src/hooks/useUserList.ts
import { useState } from 'react';

export interface UserInfo {
  name: string;
  avatar: string;
  intro: string;
}
export const useUserList = (initialList: UserInfo[] = []) => {
  const [userList, setUserList] = useState<UserInfo[]>(initialList);

  // 添加用户
  const addNewUser = (newUser: UserInfo) => {
    setUserList((prev) => [...prev, newUser]);
  };

  // 删除用户
  const deleteUser = (userName: string) => {
    setUserList((prev) => prev.filter((user) => user.name !== userName));
  };

  // 修改用户简介
  const updateUserIntro = (userName: string, newIntro: string) => {
    setUserList((prev) =>
      prev.map((user) => (user.name === userName ? { ...user, intro: newIntro } : user))
    );
  };

  return {
    userList,
    addNewUser,
    deleteUser,
    updateUserIntro,
  };
};
