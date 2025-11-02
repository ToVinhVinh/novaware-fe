import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getChat,
	sendMessage,
	getAllChats,
} from '../../lib/api/chat';
import * as ChatTypes from '../../interface/response/chat';
import * as ChatRequestTypes from '../../interface/request/chat';

export const useGetChat = (userId: string) => {
	return useQuery<ChatTypes.IGetChatResponse, Error>({
		queryKey: ['chats', 'detail', userId],
		queryFn: () => getChat(userId),
		enabled: !!userId,
	});
};

export const useGetAllChats = (query?: ChatRequestTypes.IGetAllChatsQuery) => {
	return useQuery<ChatTypes.IGetAllChatsResponse, Error>({
		queryKey: ['chats', 'list', query],
		queryFn: () => getAllChats(query),
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ChatTypes.ISendMessageResponse,
		Error,
		{ userId: string; body: ChatRequestTypes.ISendMessageBody }
	>({
		mutationFn: ({ userId, body }) => sendMessage(userId, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['chats', 'detail', variables.userId] });
		},
	});
};

