#!/usr/bin/env node
import { GoogleWorkspaceServer } from './server.js';

const server = new GoogleWorkspaceServer();
server.run().catch(console.error);
