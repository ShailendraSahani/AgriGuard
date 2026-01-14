'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';


const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER || '000000000000000000000001'; // for testing