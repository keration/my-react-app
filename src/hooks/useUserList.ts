//用户列表管理
// src/hooks/useUserList.ts
import { useState } from 'react';

export interface UserInfo {
  id?: number; // 新增可选的 id 字段（初始化时自动生成）
  name: string;
  avatar: string;
  intro: string;
}

export const useUserList = (initialUsers: UserInfo[] = []) => {
  const [userList, setUserList] = useState(
    initialUsers.map((user) => ({ ...user, id: Date.now() + Math.random() }))
  );

  // 核心修复：给 newUser 添加 UserInfo 类型注解
  const addNewUser = (newUser: UserInfo) => {
    setUserList([...userList, { ...newUser, id: Date.now() + Math.random() }]);
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
