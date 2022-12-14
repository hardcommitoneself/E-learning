import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, View } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import Icon from 'react-native-vector-icons/Feather';

import logoImg from '../../assets/logo.png';

import { 
  Container,
  Header,
  Content,
  Video,
  LessonDetails,
  Title,
  Info,
  InfoText,
  Clock,
  Description,
  LessonsNavigation,
  PreviousButton,
  PreviousButtonText,
  NextButton,
  NextButtonText,
} from './styles'
import api from '../../services/api';

interface Params {
  courseId: number;
  id: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: string;
}

const Lesson: React.FC = () => {
  const [lesson, setLesson] = useState({} as Lesson);
  const [maxLessons, setMaxLessons] = useState(0);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const lessonNumber = useCallback((id: number) => {
    if (id < 10) return `0${id}`;
    else return id;
  }, []);

  const handleNavigation = useCallback((id: number) => {
    navigation.navigate('Lesson', { courseId: routeParams.courseId, id });
  }, [navigation]);

  useEffect(() => {
    async function loadCourse() {
      const { data } = await api.get(`/courses/${routeParams.courseId}`);

      const dataLesson = data.lessons[routeParams.id - 1];

      setLesson(dataLesson);
      setMaxLessons(data.lessons.length);
    }

    loadCourse();
  }, [routeParams]);

  return (
    <Container>
      <Header>
        <Icon onPress={() => navigation.goBack()} name="arrow-left" size={24} color="#FF6680" />
        <Image source={logoImg} />
        <View style={{width: 24}} />
      </Header>
      <Content>
      <VideoPlayer
        video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
      />
        <LessonDetails>
          <Title>{lesson.title}</Title>
          <Info>
            <InfoText>Aula {lessonNumber(Number(lesson.id))}</InfoText>
            <Clock name="clock" size={16} color="#C4C4D1" />
            <InfoText>5 min</InfoText>
          </Info>
          <Description>{lesson.description || '(Nenhuma descri????o)'}</Description>
        </LessonDetails>
        <LessonsNavigation>
          {(Number(lesson.id) > 1) && <PreviousButton onPress={() => handleNavigation(Number(lesson.id) - 1)}>
            <Icon name="arrow-left" size={20} color="#FF6680" />
            <PreviousButtonText>Aula anterior</PreviousButtonText>
          </PreviousButton>}
          {(Number(lesson.id) < maxLessons) && <NextButton onPress={() => handleNavigation(Number(lesson.id) + 1)}>
            <NextButtonText>Pr??xima aula</NextButtonText>
            <Icon name="arrow-right" size={20} color="#fff" />
          </NextButton>}
        </LessonsNavigation>
      </Content>
    </Container>
  )
}

export default Lesson;