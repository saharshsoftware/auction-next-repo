'use client';
import { IUserData, User } from '@/types';
import { UserProfileApiResponse } from '@/interfaces/UserProfileApi';
import { getUserDetails } from '@/services/auth';
import { REACT_QUERY, isInternalUserEmail } from '@/shared/Constants';
import { QueryObserverResult, useQuery } from '@tanstack/react-query';

interface IUserProfile {
  userProfileData: Pick<User, "name" | "email" | "username" | "interestedCities" | "interestedCategories" | "userType" | "budgetRanges"> | null;
  fullProfileData: UserProfileApiResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  setUserProfile: (user: IUserData) => void;
  isInternalUser: boolean;
}

export const useUserProfile = (
  enabled = true,
  initialProfileData?: UserProfileApiResponse | null
): IUserProfile => {
  const {
    data: userProfile,
    isLoading: isLoadingUserProfile,
    refetch: refetchUserProfile,
    error: errorUserProfile,
  } = useQuery<UserProfileApiResponse>({
    queryKey: [REACT_QUERY.USER_PROFILE],
    queryFn: getUserDetails,
    enabled,
    initialData: initialProfileData ?? undefined,
  });

  const normalizedProfile = userProfile ?? null;
  const isInternalUser = isInternalUserEmail(normalizedProfile?.email ?? null);

  return {
    userProfileData: normalizedProfile as Pick<User, "name" | "email" | "username" | "interestedCities" | "interestedCategories" | "userType" | "budgetRanges"> | null,
    fullProfileData: normalizedProfile,
    isLoading: isLoadingUserProfile,
    error: errorUserProfile,
    setUserProfile: () => {},
    refetch: refetchUserProfile,
    isInternalUser,
  };
};