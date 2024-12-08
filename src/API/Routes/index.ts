import { AccountController } from '@api/Controller';
import { AccountRepository, OTPRepository } from '@domain/Repositories';
import { Database } from '@infrastructure/Database';
import { IO } from '@infrastructure/Websocket';
import { Router } from 'express';
import { AccountNotification } from 'Handlers/Notification';
import { AccountService } from 'Service';
import { Server } from 'socket.io';
import { Authentication } from '@api/Middleware';
import AccountRoutes from './AccountRoutes';
import UserRoutes from './UserRoutes';
import { UserController } from '@api/Controller/UserController';
import UserFlashcardRoutes from './UserFlashcardRoutes';
import { UserService } from 'Service/UserService';
import { UserFlashcardController } from '@api/Controller/UserFlashcardController';
import { UserFlashcardService } from 'Service/UserFlashcardService';
import { UserFlashcardReopository } from '@domain/Repositories/UserFlashcardRepository';

const router = Router();

const database = new Database();
const acctrepo = new AccountRepository(database);
const otprepo = new OTPRepository(database);
const userflshcrdrepo = new UserFlashcardReopository(database);

const acctNotification = new AccountNotification();

const Auth = Authentication(acctrepo);
const acctctr = new AccountController(
    new AccountService(acctrepo, otprepo, acctNotification),
);
const userctr = new UserController(new UserService(acctrepo));
const userflshcrdctrl = new UserFlashcardController(
    new UserFlashcardService(userflshcrdrepo)
);

const io = new Server();

// const io_obj = new IO(io);

router.use('/accounts', AccountRoutes(acctctr, Auth));
router.use('/users', UserRoutes(userctr, Auth));
router.use('/users/flashcards', UserFlashcardRoutes(userflshcrdctrl, Auth));
// router.use('/users/courses', )

export { router, io };
