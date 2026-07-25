<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { useAuth0 } from '@auth0/auth0-vue';
import { useMutation } from 'villus';
import { ROUTES } from '~/config/routes';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';
import { SignInByAuth0Document } from '~/api-service/generated/graphql';

definePageMeta({ layout: 'default' });

const { getAccessTokenSilently } = useAuth0();
const { setSession } = useAuth();
const router = useRouter();

const { execute } = useMutation(SignInByAuth0Document);

onMounted(async () => {
  try {
    const auth0Token = await getAccessTokenSilently();
    const { data, error } = await execute({ input: { accessToken: auth0Token } });

    if (error || !data?.signInByAuth0?.data) {
      console.error('Auth0 callback failed:', error);
      await router.push(ROUTES.auth.login);
      return;
    }

    const { accessToken, user } = data.signInByAuth0.data;
    setSession(accessToken, user);
    const homePath = getHomeRouteByPrivileges(user.privileges);
    await router.push(homePath);
  } catch (err) {
    console.error('Auth0 callback error:', err);
    await router.push(ROUTES.auth.login);
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Loader2 class="size-8 animate-spin text-primary" />
    <p class="text-sm text-gray-500">Completing sign in...</p>
  </div>
</template>
