/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect } from 'react';
import { IUserData, User } from '@/types';
import { UserProfileApiResponse } from '@/interfaces/UserProfileApi';
import { getUserDetails } from '@/services/auth';
import { REACT_QUERY } from '@/shared/Constants';
import { QueryObserverResult, useQuery } from '@tanstack/react-query';

interface IUserProfile {
  userProfileData: Pick<User, "name" | "email" | "username" | "interestedCities" | "interestedCategories" | "userType" | "budgetRanges"> | null;
  fullProfileData: UserProfileApiResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  setUserProfile: (user: IUserData) => void;
}

export const useUserProfile = (enabled = true): IUserProfile => {
  const { data: userProfile, isLoading: isLoadingUserProfile, refetch: refetchUserProfile,error: errorUserProfile} =
  useQuery({
    queryKey: [REACT_QUERY.USER_PROFILE],
    queryFn: getUserDetails,
    enabled: enabled
  });
  
  useEffect(() => {
    if (enabled) {
      refetchUserProfile();
    }
  }, [enabled]);

  return {
    userProfileData: userProfile,
    fullProfileData: userProfile as UserProfileApiResponse,
    isLoading: isLoadingUserProfile,
    error: errorUserProfile,
    setUserProfile: () => {},
    refetch: refetchUserProfile,
  };
};